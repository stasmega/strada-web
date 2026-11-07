const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const fingerprint = require('../tools/legal-fingerprint.cjs');
const expected = require('../locales/legal-source.json');

test('all legal source fingerprints match both Linux and Windows checkouts', () => {
  for (const [route, hash] of Object.entries(expected)) {
    const html = fs.readFileSync(path.join(__dirname, '..', route, 'index.html'), 'utf8');
    const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1];
    const lf = article.replace(/\r\n?/g, '\n');
    assert.equal(fingerprint(lf), hash, route + ': LF');
    assert.equal(fingerprint(lf.replace(/\n/g, '\r\n')), hash, route + ': CRLF');
    assert.notEqual(fingerprint(lf.replace('2026', '2027')), hash, route + ': real content change must invalidate the translation');
  }
});
