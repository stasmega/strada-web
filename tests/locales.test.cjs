const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const routes=['','home','privacy','terms','delete-account','stop'];
test('all localized pages have working local assets, links and language alternatives',()=>{
  for(const lang of ['en','et','ru']) for(const route of routes){
    const file=path.join(root,lang==='en'?'':lang,route,'index.html');
    const html=fs.readFileSync(file,'utf8');
    assert.ok(html.includes(`<html lang="${lang}">`),file);
    for(const other of ['en','et','ru']){
      assert.ok(html.includes(`rel="alternate" hreflang="${other}"`),file);
      assert.ok(html.includes(`data-language="${other}"`),file);
    }
    const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
    assert.equal(ids.length,new Set(ids).size,file+' has duplicate IDs');
    for(const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
      const url=match[1];
      if(/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(url))continue;
      const [pathname,hash]=url.split('#');
      const target=path.resolve(path.dirname(file),pathname.split('?')[0]||'.');
      assert.ok(fs.existsSync(target),file+' -> '+url);
      if(!pathname&&hash) assert.ok(ids.includes(hash),file+' -> '+url);
    }
    assert.ok(!html.includes('@@PARAGRAPH_'),file);
  }
});
test('localized policy documents retain all sections and paragraphs',()=>{
  for(const route of ['privacy','terms','delete-account']){
    const en=fs.readFileSync(path.join(root,route,'index.html'),'utf8');
    const article=s=>s.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1];
    for(const lang of ['et','ru']){
      const html=fs.readFileSync(path.join(root,lang,route,'index.html'),'utf8');
      for(const tag of ['p','h2','li']) assert.equal([...article(html).matchAll(new RegExp('<'+tag+'\\b','g'))].length,[...article(en).matchAll(new RegExp('<'+tag+'\\b','g'))].length,lang+'/'+route+'/'+tag);
      assert.ok(html.includes('support.strada@gmail.com'));
      assert.ok(!article(html).includes('Effective date:'));
    }
  }
});
