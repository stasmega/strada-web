const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const storageSource = fs.readFileSync(path.join(root, 'assets/storage.js'), 'utf8');
const languageSource = fs.readFileSync(path.join(root, 'assets/language.js'), 'utf8');
const choiceKey = 'strada-storage-choice-v1';
const languageKey = 'strada-language';

function visit(values = new Map(), language = 'en', blocked = false) {
  const events = {};
  const elements = {};
  const element = name => elements[name] = {
    hidden: true, listeners: {},
    addEventListener(event, callback) { this.listeners[event] = callback; },
    focus() { document.activeElement = this; }
  };
  const accept = element('accept'), necessary = element('necessary'), settings = element('settings');
  const notice = element('notice');
  const controls = { '[data-storage-accept]': accept, '[data-storage-necessary]': necessary };
  notice.querySelector = selector => controls[selector];
  notice.contains = element => Object.values(controls).includes(element);
  const document = {
    documentElement: { lang: language }, activeElement: null,
    querySelector: selector => selector === '[data-storage-notice]' ? notice : settings
  };
  const localStorage = {
    getItem(key) { if (blocked) throw Error('Storage disabled'); return values.get(key) ?? null; },
    setItem(key, value) { if (blocked) throw Error('Storage disabled'); values.set(key, value); },
    removeItem(key) { if (blocked) throw Error('Storage disabled'); values.delete(key); }
  };
  const window = { addEventListener(event, callback) { events[event] = callback; } };
  const context = { window, document, localStorage };
  vm.runInNewContext(storageSource, context);
  const click = name => { document.activeElement = elements[name]; elements[name].listeners.click(); };
  return { values, notice, settings, window, context, events, document, click };
}

test('first visit asks before remembering a language and discards legacy preferences', () => {
  const page = visit(new Map([[languageKey, 'ru']]));
  assert.equal(page.notice.hidden, false);
  assert.equal(page.values.has(languageKey), false);
  page.window.stradaStorage.rememberLanguage('et');
  assert.equal(page.values.size, 0);
  assert.equal(page.window.stradaStorage.language(), null);
});

test('only necessary survives navigation and does not remember language switches', () => {
  const page = visit();
  page.click('necessary');
  assert.equal(page.notice.hidden, true);
  assert.equal(page.values.get(choiceKey), 'necessary');
  page.window.stradaStorage.rememberLanguage('ru');
  const nextPage = visit(page.values, 'ru');
  assert.equal(nextPage.notice.hidden, true);
  assert.equal(nextPage.window.stradaStorage.language(), null);
});

test('accepting remembers the current language and later explicit language selections', () => {
  const page = visit(new Map(), 'ru');
  page.click('accept');
  assert.equal(page.values.get(languageKey), 'ru');
  page.window.stradaStorage.rememberLanguage('et');
  const nextPage = visit(page.values);
  assert.equal(nextPage.notice.hidden, true);
  assert.equal(nextPage.window.stradaStorage.language(), 'et');
  nextPage.window.stradaStorage.rememberLanguage('invalid');
  assert.equal(nextPage.values.get(languageKey), 'et');
});

test('footer settings allow withdrawal and restore keyboard focus', () => {
  const page = visit(new Map([[choiceKey, 'preferences'], [languageKey, 'ru']]));
  page.click('settings');
  assert.equal(page.notice.hidden, false);
  assert.equal(page.document.activeElement, page.notice.querySelector('[data-storage-necessary]'));
  page.click('necessary');
  assert.equal(page.values.has(languageKey), false);
  assert.equal(page.document.activeElement, page.settings);
  assert.equal(visit(page.values).notice.hidden, true);
});

test('blocked browser storage still lets visitors dismiss and change their choice', () => {
  const page = visit(new Map(), 'et', true);
  assert.doesNotThrow(() => page.click('accept'));
  assert.equal(page.notice.hidden, true);
  page.click('settings');
  assert.equal(page.notice.hidden, false);
  assert.doesNotThrow(() => page.click('necessary'));
  assert.equal(page.notice.hidden, true);
});

test('a choice changed in another tab disables optional storage in this tab', () => {
  const page = visit(new Map([[choiceKey, 'preferences'], [languageKey, 'ru']]));
  page.values.set(choiceKey, 'necessary');
  page.events.storage({ key: choiceKey });
  assert.equal(page.window.stradaStorage.language(), null);
  assert.equal(page.values.has(languageKey), false);
});

test('language redirects respect consent and preserve shared-stop query and fragment', () => {
  for (const choice of ['necessary', 'preferences']) {
    const page = visit(new Map([[choiceKey, choice], [languageKey, 'ru']]));
    let destination = null;
    page.context.URL = URL;
    page.context.location = {
      pathname: '/stop/', search: '?id=tlt_10', hash: '#departures',
      replace(url) { destination = url; }
    };
    page.context.document.currentScript = { src: 'https://stradaapp.eu/assets/language.js' };
    page.context.document.querySelectorAll = () => [];
    vm.runInNewContext(languageSource, page.context);
    assert.equal(destination, choice === 'preferences' ? 'https://stradaapp.eu/ru/stop/?id=tlt_10#departures' : null);
  }
});

test('each generated page includes localized controls, policy link and storage before language scripts', () => {
  const copy = require('../locales/storage.cjs');
  for (const lang of ['en', 'et', 'ru']) for (const route of ['', 'home', 'privacy', 'terms', 'delete-account', 'stop']) {
    const html = fs.readFileSync(path.join(root, lang === 'en' ? '' : lang, route, 'index.html'), 'utf8');
    assert.ok(html.includes(copy[lang].title), lang + '/' + route);
    assert.ok(html.includes(copy[lang].settings));
    assert.equal((html.match(/data-storage-notice/g) || []).length, 1);
    assert.equal((html.match(/data-storage-settings/g) || []).length, 1);
    assert.ok(html.indexOf('/storage.js?') < html.indexOf('/language.js?'));
    assert.ok(html.includes('/#website-storage'));
  }
});

test('the Pages artifact includes the original logo at its root', () => {
  const workflow = fs.readFileSync(path.join(root, '.github/workflows/pages.yml'), 'utf8');
  assert.match(workflow, /cp[^\n]*stradalogo_main_preview\.png[^\n]*_site\//);
  const logo = fs.readFileSync(path.join(root, 'stradalogo_main_preview.png'));
  assert.deepEqual([...logo.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
});
