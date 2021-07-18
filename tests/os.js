const test = require('kuta').test;
const os = require('../src/os')
const assert = require('assert')
const _ = require('./utils')

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
  assert.deepEqual('win32', os.guessFromFilename('Assessment.Disaggregation-1.1.4.Setup.exe'))
});

test('it should guess correctly from file list', ()=> {
  assert.deepEqual('win32', os.guessFromContents(_.getEntries('Arizona-v1.0.0-beta-Windows.zip')));
  assert.deepEqual('win32', os.guessFromContents(_.getEntries('Notable-1.8.4-win.zip')));
  assert.deepEqual('darwin', os.guessFromContents(_.getEntries('encrypt0r-mac.zip')));
  assert.deepEqual('darwin', os.guessFromContents(_.getEntries('Hyper-3.0.2-mac.zip')));
  assert.deepEqual('linux', os.guessFromContents(_.getEntries('chronobreak-linux-x64.zip')));
  assert.deepEqual('linux', os.guessFromContents(_.getEntries('Rambox-0.7.7-linux-x64.zip')));
});

