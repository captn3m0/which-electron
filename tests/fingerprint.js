const test = require("kuta").test;
const fp = require("../src/fingerprint");
const assert = require("assert");

test("it should work with a single fingerprint", () => {
  guess = fp.guessFromHashes("win32", "x64", [
    "cbdbe566564c323032c02c1a838358a314af63b4",
  ]);
  assert.deepEqual(guess, ["v0.24.0"]);
});

test("it should work with a ffmpeg hash", () => {
  guess = fp.guessFromHashes("win32", "x64", [
    "baf786083f482c1f035e50e105b5f7475af1e00b",
  ]);
  assert.deepEqual(guess, ["v1.4.3", "v1.4.4", "v1.4.5"]);
});

test("it should work with multiple fingerprints", () => {
  hashes = [
    "45c1db70ce3062aae85069629519e61bac6cf5d2",
    "944bff8704d4b152279fbdacb911b516502be056",
    "3c592e2cdadbb0bcd8f522071a63da5febe9aa37",
  ];
  guess = fp.guessFromHashes("darwin", "x64", hashes);
  assert.deepEqual(guess, ["v1.7.6"]);
});
