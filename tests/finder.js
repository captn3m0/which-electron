const test = require('kuta').test;
const finder = require('../finder')
const assert = require('assert')
const fs = require('fs')

function getEntries(fn) {
  return JSON.parse(fs.readFileSync(`./tests/fixtures/${fn}.json`))
}

test('it should find the electron.asar file', ()=> {
  assert.deepEqual(
    ['Hyper.app/Contents/Resources/electron.asar'],
    finder.asar(getEntries('Hyper-3.0.2-mac.zip'))
  )
});

test('it should find the correct binary file', () => {
  assert.deepEqual(
    'Hyper.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework',
    finder.binary(getEntries('Hyper-3.0.2-mac.zip'))
  )
  assert.deepEqual(
    'Notable.exe',
    finder.binary(getEntries('Notable-1.8.4-win.zip'))
  )
  assert.deepEqual(
    'rambox',
    finder.binary(getEntries('Rambox-0.7.7-linux-x64.zip'))
  )
})
