const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const verification = '<meta name="google-site-verification" content="aD15K3NNR1EBTBMuJzaItsr7lyzjprp93XsuAo76RkI" />';

test('Google verification stays inside the home page head, once, before the body', () => {
  for (const file of ['index.html', 'home/index.html']) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i);
    assert.ok(head, file + ' needs a complete head');
    assert.ok(head[1].includes(verification), file + ' needs the requested verification tag in its head');
    assert.equal((html.match(/name="google-site-verification"/g) || []).length, 1);
    assert.ok(html.indexOf('</head>') < html.indexOf('<body'));
  }
});

test('the uploaded Google HTML verification file retains its required content', () => {
  const filename = 'google8e19f1b2b0013f55.html';
  assert.equal(fs.readFileSync(path.join(root, filename), 'utf8').trim(), 'google-site-verification: ' + filename);
});
