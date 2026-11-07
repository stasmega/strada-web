const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../assets/stop.js'), 'utf8');

function render(search, userAgent = 'Firefox Desktop', language = 'en') {
  const elements = Object.fromEntries(['app-link', 'stop-description', 'stop-status', 'stop-title'].map(id =>
    [id, { hidden: true, textContent: '', removeAttribute(key) { delete this[key]; } }]));
  const document = { title: '', documentElement: {lang: language}, getElementById: id => elements[id] };
  vm.runInNewContext(source, { window: { location: { search } }, navigator: { userAgent }, document, URLSearchParams });
  return { elements, document };
}

test('the existing ID-only links keep working', () => {
  const { elements } = render('?id=tlt_14969');
  assert.equal(elements['app-link'].href, 'strada://stop/tlt_14969');
  assert.equal(elements['app-link'].hidden, false);
});

test('localized stops retain metadata and show localized errors and instructions', () => {
  for (const [lang, label, error] of [['ru','Код остановки: ','В ссылке нет'],['et','Peatuse kood: ','Lingil puudub']]) {
    const {elements,document} = render('?id=tlt_14969&name=Estonia&code=123','Firefox Desktop',lang);
    assert.equal(elements['app-link'].href,'strada://stop/tlt_14969?name=Estonia&code=123');
    assert.ok(elements['stop-status'].textContent.startsWith(label+'123'));
    assert.equal(elements['stop-title'].textContent,'Estonia');
    assert.match(document.title,/Strada/);
    const invalid=render('?id=a&id=b','Firefox Desktop',lang);
    assert.equal(invalid.elements['app-link'].hidden,true);
    assert.ok(invalid.elements['stop-description'].textContent.startsWith(error));
  }
});
test('GTFS punctuation and public stop metadata survive the web-to-app handoff', () => {
  const input = new URLSearchParams({ id: 'elron_123:4.5', name: 'Tõnismägi & <north>', code: '12405-1', lat: '59.43', lon: '24.74', train: 'true' });
  const { elements, document } = render('?' + input);
  const link = new URL(elements['app-link'].href);
  assert.equal(decodeURIComponent(link.pathname), '/elron_123:4.5');
  assert.equal(link.searchParams.get('name'), 'Tõnismägi & <north>');
  assert.equal(elements['stop-title'].textContent, 'Tõnismägi & <north>');
  assert.equal(document.title, 'Tõnismägi & <north> — Strada stop');
  assert.equal(link.searchParams.get('train'), 'true');
});
test('Chrome on Android targets the app package and keeps a Google Play fallback', () => {
  const { elements } = render('?id=tlt_14969&name=Estonia', 'Mozilla/5.0 Android Chrome/130');
  assert.match(elements['app-link'].href, /^intent:\/\/stop\/tlt_14969\?name=Estonia#Intent;scheme=strada;package=com\.stasmega\.strada;/);
  assert.ok(elements['app-link'].href.includes(encodeURIComponent('https://play.google.com/store/apps/details?id=com.stasmega.strada')));
});
test('missing, duplicate and malformed identifiers never expose a broken app button', () => {
  for (const query of ['', '?id=', '?id=a&id=b', '?id=a%00b', '?id=%FF', '?id=' + 'a'.repeat(257)]) {
    const { elements } = render(query);
    assert.equal(elements['app-link'].hidden, true);
    assert.equal(elements['app-link'].href, undefined);
    assert.match(elements['stop-description'].textContent, /valid stop ID/);
  }
});
test('invalid coordinates and control characters do not reach the app as metadata', () => {
  const { elements } = render('?id=tlt_14969&name=bad%0Aname&code=ok&lat=Infinity&lon=24');
  const link = new URL(elements['app-link'].href);
  assert.equal(link.searchParams.get('name'), null);
  assert.equal(link.searchParams.get('lat'), null);
  assert.equal(link.searchParams.get('code'), 'ok');
});
