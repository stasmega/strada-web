const fs = require('node:fs');
const path = require('node:path');
const fingerprint = require('./legal-fingerprint.cjs');
const ui = require('../locales/ui.cjs');
const legal = require('../locales/legal.cjs');
const storage = require('../locales/storage.cjs');
const root = path.resolve(__dirname, '..');
const origin = 'https://stasmega.github.io/strada-web/';
const routes = ['', 'home', 'privacy', 'terms', 'delete-account', 'stop'];
const languages = ['en', 'et', 'ru'];
const labels = {en:'English', et:'Eesti', ru:'Русский'};
const unchanged = new Set(['Strada','Google Play','Google Play ↗','Kristiine keskus','Lennujaam','support@stradaapp.eu','↗','.',',']);
const dictionaries = Object.fromEntries(languages.map((lang,i) => [lang,new Map(ui.map(row=>[row[0],row[i]]))]));
const escape = s => s.replaceAll('&','&amp;').replaceAll('"','&quot;');
const rel = (from,to) => path.relative(from,to).replaceAll('\\','/') || '.';
const fileFor = (lang,route) => path.join(root,lang === 'en' ? '' : lang,route,'index.html');
const failures = [];
const legalSourcePath=path.join(root,'locales/legal-source.json');
const legalSource=JSON.parse(fs.readFileSync(legalSourcePath,'utf8'));
for(const route of Object.keys(legal)) {
  const html=fs.readFileSync(fileFor('en',route),'utf8');
  const article=html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1];
  const hash=fingerprint(article);
  if(process.argv.includes('--update-legal-source')) legalSource[route]=hash;
  else if(legalSource[route]!==hash) throw new Error(`${route}: English legal content changed. Update both translations, then run with --update-legal-source.`);
}
if(process.argv.includes('--update-legal-source')) fs.writeFileSync(legalSourcePath,JSON.stringify(legalSource,null,2)+'\n');
for (const route of routes) {
  const sourceFile = fileFor('en', route);
  const sourceDir = path.dirname(sourceFile);
  const original = fs.readFileSync(sourceFile,'utf8').replace(/<!-- language:[\s\S]*?<!-- \/language -->\s*/g,'');
  for (const lang of languages) {
    const file = fileFor(lang, route), dir = path.dirname(file);
    const translate = text => {
      const key = text.trim();
      if (!key || lang === 'en' || unchanged.has(key)) return text;
      const value = dictionaries[lang].get(key);
      if (value === undefined) { failures.push(`${lang}/${route}: ${key}`); return text; }
      return text.replace(key,value);
    };
    let html = original;
    // Paragraphs with embedded links are translated as complete units.
    // Mask them while translating the remaining original English text nodes.
    const paragraphSlots = [];
    if (legal[route] && lang !== 'en') {
      html = html.replace(/(<article\b[^>]*>)([\s\S]*?)(<\/article>)/,(_,start,body,end)=>{
        let n=0;
        body=body.replace(/(<p\b[^>]*>)([\s\S]*?)(<\/p>)/g,(_,a,b,c)=>{
          const pair=legal[route][n++];
          if (!pair) throw new Error(`Missing paragraph ${route}/${n}`);
          const id=paragraphSlots.push(pair[lang==='et'?0:1])-1;
          return a+`@@PARAGRAPH_${id}@@`+c;
        });
        if(n!==legal[route].length) throw new Error(`Paragraph count changed: ${route}`);
        return start+body+end;
      });
    }
    html=html.replace(/>([^<>]+)</g,(match,text)=>text.includes('@@PARAGRAPH_') ? match : '>'+translate(text)+'<');
    html=html.replace(/@@PARAGRAPH_(\d+)@@/g,(_,id)=>paragraphSlots[Number(id)]);
    // Translate human-readable attributes, never identifiers or destinations.
    html=html.replace(/\b(alt|aria-label|content)="([^"]*)"/g,(match,name,value)=>{
      if (!dictionaries[lang].has(value) || lang==='en') return match;
      return `${name}="${escape(dictionaries[lang].get(value))}"`;
    });
    html=html.replace('<html lang="en">',`<html lang="${lang}">`);
    html=html.replaceAll('google-play-badge-en.svg',`google-play-badge-${lang}.svg`);
    // Resolve source-relative URLs, then express them relative to the new page.
    html=html.replace(/\b(href|src)="([^"#]+)"/g,(match,attr,url)=>{
      if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(url)) return match;
      const [,pathname,suffix='']=url.match(/^([^?#]*)([?#].*)?$/);
      const target=path.resolve(sourceDir,pathname);
      let destination=target;
      if (attr==='href' && !target.includes(path.sep+'assets'+path.sep)) {
        const relative=path.relative(root,target).replaceAll('\\','/').replace(/\/index\.html$/,'');
        if(routes.includes(relative)) destination=path.join(root,lang==='en'?'':lang,relative);
      }
      let value=rel(dir,destination);
      if(url.split(/[?#]/)[0].endsWith('/')) value+='/';
      return `${attr}="${value}${suffix}"`;
    });
    const canonicalRoute=route==='home'?'':route;
    const pageUrl=l=>origin+(l==='en'?'':l+'/')+(canonicalRoute?canonicalRoute+'/':'');
    html=html.replace(/(<link rel="canonical" href=")[^"]+/, '$1'+pageUrl(lang));
    html=html.replace(/(<meta property="og:url" content=")[^"]+/, '$1'+pageUrl(lang));
    const alternate=languages.map(l=>`<link rel="alternate" hreflang="${l}" href="${pageUrl(l)}">`).join('\n');
    const asset=rel(dir,path.join(root,'assets'));
    const extras=`<!-- language:head -->\n${alternate}\n<link rel="alternate" hreflang="x-default" href="${pageUrl('en')}">\n<link rel="stylesheet" href="${asset}/language.css?v=20261108">\n<link rel="stylesheet" href="${asset}/play-badge.css?v=20261109">\n<link rel="stylesheet" href="${asset}/storage.css?v=20261109">\n<script src="${asset}/storage.js?v=20261109" defer></script>\n<script src="${asset}/language.js?v=20261109" defer></script>\n<!-- /language -->\n`;
    html=html.replace('</head>',extras+'</head>');
    const controls=languages.map(l=>{
      let href=rel(dir,path.dirname(fileFor(l,route)))+'/';
      return `<a href="${href}" lang="${l}" hreflang="${l}" data-language="${l}" aria-label="${labels[l]}"${l===lang?' aria-current="page"':''}>${l.toUpperCase()}</a>`;
    }).join('');
    const switcher=`<!-- language:switch --><div class="language-switch" role="group" aria-label="${{en:'Language',et:'Keel',ru:'Язык'}[lang]}">${controls}</div><!-- /language -->`;
    html=html.replace('<details class="mobile-menu">',switcher+'<details class="mobile-menu">');
    const copy=storage[lang];
    const policy=rel(dir,path.dirname(fileFor(lang,'privacy'))) + '/#website-storage';
    const notice=`<!-- language:storage -->
<section class="storage-notice" data-storage-notice aria-labelledby="storage-title" aria-describedby="storage-description" hidden>
<div class="storage-notice-header"><span class="storage-notice-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3 3.5 6.5v5.8c0 4.1 3.5 7.2 8.5 9.2 5-2 8.5-5.1 8.5-9.2V6.5Z"/><path d="m8 12 2.5 2.5L16 9"/></svg></span><h2 id="storage-title">${copy.title}</h2></div>
<p id="storage-description">${copy.body}</p>
<a class="storage-privacy" href="${policy}">${copy.privacy}</a>
<div class="storage-actions"><button type="button" class="storage-necessary" data-storage-necessary>${copy.necessary}</button><button type="button" class="storage-accept" data-storage-accept>${copy.accept}</button></div>
</section>
<!-- /language -->
`;
    const settings=`<!-- language:storage-settings --><div class="storage-settings-row"><button type="button" class="storage-settings" data-storage-settings hidden>${copy.settings}</button></div><!-- /language -->`;
    html=html.replace('</footer>',settings+'</footer>').replace('</body>',notice+'</body>');
    fs.mkdirSync(dir,{recursive:true});
    fs.writeFileSync(file,html);
  }
}
const indexedRoutes=['','privacy','terms','delete-account'];
const sitemap=languages.flatMap(lang=>indexedRoutes.map(route=>{
  const url=l=>origin+(l==='en'?'':l+'/')+(route?route+'/':'');
  return '<url><loc>'+url(lang)+'</loc>'+languages.map(l=>`<xhtml:link rel="alternate" hreflang="${l}" href="${url(l)}"/>`).join('')+'</url>';
})).join('\n');
fs.writeFileSync(path.join(root,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'+sitemap+'\n</urlset>\n');
if(failures.length) { console.error([...new Set(failures)].join('\n'));process.exitCode=1; }
else console.log('Generated 18 pages in EN, ET and RU. Translation coverage complete.');
