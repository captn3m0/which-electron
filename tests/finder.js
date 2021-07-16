const test = require("kuta").test;
const finder = require("../finder");
const assert = require("assert");
const _ = require('./utils')

test("it should find the electron.asar file", () => {
  assert.deepEqual(
    ["Hyper.app/Contents/Resources/electron.asar"],
    finder.asar(_.getEntries("Hyper-3.0.2-mac.zip"))
  );
});

test("it should find the correct binary file", () => {
  assert.deepEqual(
    "Hyper.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework",
    finder.binary(_.getEntries("Hyper-3.0.2-mac.zip"))
  );
  assert.deepEqual(
    "Notable.exe",
    finder.binary(_.getEntries("Notable-1.8.4-win.zip"))
  );
  assert.deepEqual(
    "rambox",
    finder.binary(_.getEntries("Rambox-0.7.7-linux-x64.zip"))
  );
});

test("it should find the version file", () => {
  assert.deepEqual(
    ["chronobreak-linux-x64/version"],
    finder.version(_.getEntries("chronobreak-linux-x64.zip"))
  );
  assert.deepEqual(
    ["release-builds/encrypt0r-darwin-x64/version"],
    finder.version(_.getEntries("encrypt0r-mac.zip"))
  );
  assert.deepEqual(
    [
      "Arizona v.1.0.0/resources/app/node_modules/electron/dist/version",
      "Arizona v.1.0.0/version",
    ],
    finder.version(_.getEntries("Arizona-v1.0.0-beta-Windows.zip"))
  );
});
