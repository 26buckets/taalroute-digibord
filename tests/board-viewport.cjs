const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const viewport = vm.runInNewContext(fs.readFileSync(path.join(root, 'board-viewport.js'), 'utf8') + ';BoardViewport');
for (const file of ['data/rotterdam-route.json', 'data/zwolle-route.json', 'tests/fixtures/deventer.json']) {
  const route = JSON.parse(fs.readFileSync(path.join(root, file)));
  const [x, y, s] = viewport.sourceTransform(route).match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/g).map(Number);
  assert.ok(x >= -1e-7 && y >= -1e-7 && s > 0);
  assert.ok(Math.abs(x * 2 + route.sourceWidth * s - 1920) < 1e-7);
  assert.ok(Math.abs(y * 2 + route.sourceHeight * s - 900) < 1e-7);
  for (const node of route.nodes) {
    assert.ok(node.x * s + x >= 0 && node.x * s + x <= 1920);
    assert.ok(node.y * s + y >= 0 && node.y * s + y <= 900);
  }
}
for (const n of [0, -1, NaN, Infinity, '1920']) {
  assert.throws(() => viewport.sourceTransform({sourceWidth: n, sourceHeight: 900}), /positive finite/);
  assert.throws(() => viewport.sourceTransform({sourceWidth: 1920, sourceHeight: n}), /positive finite/);
}
assert.equal(viewport.sourceTransform({sourceWidth: 1920, sourceHeight: 900}), 'translate(0 0) scale(1)');
console.log('PASS: immutable source-to-design mapping, bounds, aspect ratio and invalid dimensions.');

const {createHash} = require('node:crypto');
for (const [file, hash] of Object.entries(require('./fixtures/frozen-sha256.json'))) {
  assert.equal(createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex'),hash,file+' must stay frozen');
}
console.log('PASS: approved board assets, geometry, taxi asset and self-contained data bundle match their reviewed hashes.');
