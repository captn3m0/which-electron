const test = require('kuta').test;
const os = require('../os')
const assert = require('assert')

test('it should linux correctly from filename', ()=> {
  assert.deepEqual('linux', os.guessFromFilename('kube-dev-dashboard-0.10.1-linux.zip'))
  assert.deepEqual('linux', os.guessFromFilename('magiccap-linux.zip'))
  assert.deepEqual('linux', os.guessFromFilename('Rambox-0.7.7-linux-ia32.zip'))
  assert.deepEqual('linux', os.guessFromFilename('authme-2.6.0-linux-x64-portable.zip'))
  assert.deepEqual('linux', os.guessFromFilename('mojibar-linux.zip'))
  assert.deepEqual('linux', os.guessFromFilename('mojibar-linux.deb'))
  assert.deepEqual('linux', os.guessFromFilename('mojibar.AppImage'))
  assert.deepEqual('linux', os.guessFromFilename('mojibar.pacman'))
});

test('it should darwin correctly from filename', ()=> {
  assert.deepEqual('darwin', os.guessFromFilename('Merge-Request-Notifier-1.9.0-mac.zip'))
  assert.deepEqual('darwin', os.guessFromFilename('Merge-Request-Notifier-1.9.0.dmg'))
});

test('it should windows correctly from filename', ()=> {
  assert.deepEqual('win32', os.guessFromFilename('particl-desktop-2.3.6-win-ia32.zip'))
  assert.deepEqual('win32', os.guessFromFilename('Multrin-1.3.0-ia32-win.zip'))
  assert.deepEqual('win32', os.guessFromFilename('Multrin-1.3.0-ia32-win.exe'))
});
