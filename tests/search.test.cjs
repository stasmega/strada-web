const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const copy=require('../locales/seo.cjs');
const origin='https://stradaapp.eu/';
const languages=['en','et','ru'];
const routes=['','home','privacy','terms','delete-account','stop'];
const read=file=>fs.readFileSync(path.join(root,file),'utf8');

test('canonical, sharing and reciprocal language URLs use the custom domain',()=>{
 for(const lang of languages) for(const route of routes) {
  const page=(lang==='en'?'':lang+'/')+(route?route+'/':'');
  const html=read(page+'index.html');
  const canonicalRoute=route==='home'?'':route;
  const url=l=>origin+(l==='en'?'':l+'/')+(canonicalRoute?canonicalRoute+'/':'');
  assert.ok(html.includes(`<link rel="canonical" href="${url(lang)}">`),page);
  assert.ok(html.includes(`<meta property="og:url" content="${url(lang)}">`),page);
  for(const other of [...languages,'x-default']) assert.ok(html.includes(`hreflang="${other}" href="${url(other==='x-default'?'en':other)}"`),page);
  assert.ok(!html.includes('https://stasmega.github.io/strada-web/'),page);
 }
 const sitemap=read('sitemap.xml');
 const locations=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
 assert.equal(locations.length,12);
 for(const url of locations) assert.ok(url.startsWith(origin),url);
 assert.ok(read('robots.txt').includes('Sitemap: '+origin+'sitemap.xml'));
 assert.ok(read('.github/workflows/pages.yml').includes('sitemap.xml robots.txt'));
});

test('localized application facts are present in visible HTML and valid JSON-LD',()=>{
 for(const lang of languages) {
  const html=read((lang==='en'?'':lang+'/')+'index.html');
  const scripts=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length,1);
  const app=JSON.parse(scripts[0][1]);
  assert.equal(app['@type'],'MobileApplication');
  assert.equal(app['@id'],origin+'#app');
  assert.equal(app.operatingSystem,'Android');
  assert.equal(app.offers.price,'0');
  assert.deepEqual(app.sameAs,['https://play.google.com/store/apps/details?id=com.stasmega.strada']);
  assert.ok(!('aggregateRating' in app));
  assert.ok(!app.sameAs.includes(app.author.url));
  assert.equal(app.description,copy[lang].description);
  assert.ok(html.includes(`<p class="hero-description">${app.description}</p>`));
  assert.equal((html.match(/id="faq"/g)||[]).length,1);
  for(const [question,answer] of copy[lang].questions) {
   assert.ok(html.includes(`<summary>${question}</summary>`));
   assert.ok(html.includes(`<p>${answer}</p>`));
  }
 }
});
