import { test } from "uvu";
import * as assert from "uvu/assert";

import { guessFromFilename, guessFromContents } from "../src/os.js";
import { getEntries } from "./utils.js";

test("it should linux correctly from filename", () => {
  assert.equal(
    "linux",
    guessFromFilename("kube-dev-dashboard-0.10.1-linux.zip")
  );
  assert.equal("linux", guessFromFilename("magiccap-linux.zip"));
  assert.equal("linux", guessFromFilename("Rambox-0.7.7-linux-ia32.zip"));
  assert.equal(
    "linux",
    guessFromFilename("authme-2.6.0-linux-x64-portable.zip")
  );
  assert.equal("linux", guessFromFilename("mojibar-linux.zip"));
  assert.equal("linux", guessFromFilename("mojibar-linux.deb"));
  assert.equal("linux", guessFromFilename("mojibar.AppImage"));
  assert.equal("linux", guessFromFilename("mojibar.pacman"));
});

test("it should darwin correctly from filename", () => {
  assert.equal(
    "darwin",
    guessFromFilename("Merge-Request-Notifier-1.9.0-mac.zip")
  );
  assert.equal(
    "darwin",
    guessFromFilename("Merge-Request-Notifier-1.9.0.dmg")
  );
});

test("it should windows correctly from filename", () => {
  assert.equal(
    "win32",
    guessFromFilename("particl-desktop-2.3.6-win-ia32.zip")
  );
  assert.equal("win32", guessFromFilename("Multrin-1.3.0-ia32-win.zip"));
  assert.equal("win32", guessFromFilename("Multrin-1.3.0-ia32-win.exe"));
  assert.equal(
    "win32",
    guessFromFilename("Assessment.Disaggregation-1.1.4.Setup.exe")
  );
});

test("it should guess correctly from file list", () => {
  assert.equal(
    "win32",
    guessFromContents(getEntries("Arizona-v1.0.0-beta-Windows.zip"))
  );
  assert.equal(
    "win32",
    guessFromContents(getEntries("Notable-1.8.4-win.zip"))
  );
  assert.equal(
    "darwin",
    guessFromContents(getEntries("encrypt0r-mac.zip"))
  );
  assert.equal(
    "darwin",
    guessFromContents(getEntries("Hyper-3.0.2-mac.zip"))
  );
  assert.equal(
    "linux",
    guessFromContents(getEntries("chronobreak-linux-x64.zip"))
  );
  assert.equal(
    "linux",
    guessFromContents(getEntries("Rambox-0.7.7-linux-x64.zip"))
  );
});

test.run();
