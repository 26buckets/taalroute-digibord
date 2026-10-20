const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => {
  const file = path.join(root, new URL(req.url, 'http://localhost').pathname);
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404); return res.end();
  }
  res.setHeader('Content-Type', file.endsWith('.js') ? 'application/javascript' : 'text/html');
  res.end(fs.readFileSync(file));
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true });
  try {
    const source = await browser.newContext(), destination = await browser.newContext();
    const oldPage = await source.newPage(), newPage = await destination.newPage();
    const url = `http://127.0.0.1:${server.address().port}/overstap-actief.html`;
    await oldPage.goto(url); await newPage.goto(url);
    const data = await oldPage.evaluate(async () => {
      localStorage.setItem('taalroute-digibord-v020', '{"groups":["Groep 1"],"route":"play"}');
      localStorage.setItem('taalroute-methode-digibord-v1', '{"book":"fundament"}');
      localStorage.setItem('unrelated', 'keep-private');
      const data = { format: 'taalroute-actief-transfer', version: 1, local: {}, records: [['saved_selection:lesson-1', { saved_selection_id: 'lesson-1', record_revision: 3, name: 'Mijn les' }]] };
      await ActiefTransfer.restore(data, localStorage, indexedDB);
      return ActiefTransfer.snapshot(localStorage, indexedDB);
    });
    assert.equal(Object.keys(data.local).length, 1);
    assert.equal(data.records.length, 1);
    assert.equal(await newPage.evaluate(() => localStorage.length), 0);
    const result = await newPage.evaluate(async data => {
      localStorage.setItem('taalroute-extra', 'preserve');
      await ActiefTransfer.restore(data, localStorage, indexedDB);
      return ActiefTransfer.snapshot(localStorage, indexedDB);
    }, data);
    assert.deepEqual(result.records, data.records);
    assert.equal(result.local['taalroute-extra'], 'preserve');
    assert.equal(result.local['taalroute-digibord-v020'], data.local['taalroute-digibord-v020']);
    assert.deepEqual((await oldPage.evaluate(() => ActiefTransfer.snapshot(localStorage, indexedDB))).records, data.records);
    const rollback = await newPage.evaluate(async () => {
      const before = await ActiefTransfer.snapshot(localStorage, indexedDB);
      const adapter = {
        get length() { return localStorage.length; },
        key: index => localStorage.key(index),
        getItem: key => localStorage.getItem(key),
        removeItem: key => localStorage.removeItem(key),
        setItem(key, value) {
          if (value === 'quota-failure') throw new DOMException('Quota reached', 'QuotaExceededError');
          localStorage.setItem(key, value);
        },
      };
      let rejected = false;
      try {
        await ActiefTransfer.restore({
          format: 'taalroute-actief-transfer', version: 1,
          local: { 'taalroute-extra': 'changed', 'taalroute-new': 'quota-failure' },
          records: [['saved_selection:lesson-1', { record_revision: 99, name: 'Wrong' }]],
        }, adapter, indexedDB);
      } catch { rejected = true; }
      const after = await ActiefTransfer.snapshot(localStorage, indexedDB);
      return { rejected, localEqual: JSON.stringify(before.local) === JSON.stringify(after.local),
        recordsEqual: JSON.stringify(before.records) === JSON.stringify(after.records) };
    });
    assert.deepEqual(rollback, { rejected: true, localEqual: true, recordsEqual: true });
    const validation = await newPage.evaluate(async data => {
      let malformed = false, stale = false;
      try { ActiefTransfer.validate({ ...data, local: { unrelated: 'overwrite' } }); } catch { malformed = true; }
      const before = await ActiefTransfer.snapshot(localStorage, indexedDB);
      localStorage.setItem('taalroute-changed-elsewhere', 'new');
      try { await ActiefTransfer.restore(data, localStorage, indexedDB, before); } catch { stale = true; }
      return { malformed, stale };
    }, data);
    assert.deepEqual(validation, { malformed: true, stale: true });
    await newPage.locator('#backup').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ ...data, local: { 'taalroute-extra': 'new imported value' } })) });
    await newPage.locator('#conflict-label').waitFor({ state: 'visible' });
    assert.equal(await newPage.locator('#restore').isDisabled(), true);
    await newPage.locator('#replace').check();
    const downloaded = newPage.waitForEvent('download');
    await newPage.locator('#restore').click();
    assert.equal((await downloaded).suggestedFilename(), 'Taalroute-Actief-herstel-voor-overstap.json');
    await newPage.waitForFunction(() => document.querySelector('#status').textContent.includes('overgenomen'));
    assert.equal(await newPage.evaluate(() => localStorage.getItem('taalroute-extra')), 'new imported value');
    await source.close(); await destination.close();
    console.log('PASS: complete lesson transfer, unrelated data excluded, source retained, destination preserved, invalid input rejected, quota rollback, concurrent change detection and explicit conflict confirmation.');
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
