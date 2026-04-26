const test = require("kuta").test;
const rg = require("../src/rg");
const fs = require("fs");
const os = require("os");
const path = require("path");
const assert = require("assert");

function tmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "we-rg-test-"));
}

test("returns null for an empty dir", () => {
  const dir = tmpDir();
  try {
    assert.strictEqual(rg.findElectronVersion(dir), null);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("returns null when no binary contains the literal", () => {
  const dir = tmpDir();
  try {
    fs.writeFileSync(path.join(dir, "blob"), "ElectronVersion=1.2.3\nelectron 4.5.6\n");
    assert.strictEqual(rg.findElectronVersion(dir), null);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("finds the Electron v<x.y.z> literal across binary noise", () => {
  const dir = tmpDir();
  try {
    const pad = Buffer.alloc(8 * 1024, 0x55);
    fs.writeFileSync(
      path.join(dir, "blob"),
      Buffer.concat([pad, Buffer.from("Electron v9.9.9\0"), pad])
    );
    assert.strictEqual(rg.findElectronVersion(dir), "v9.9.9");
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("returns the first match when multiple versions appear", () => {
  // Documented first-wins behavior. In practice the framework binary
  // contains a single Electron v<x.y.z> literal; multiple matches would
  // only occur if scanning a wider tree.
  const dir = tmpDir();
  try {
    fs.writeFileSync(
      path.join(dir, "a"),
      "Electron v1.0.0\nElectron v2.0.0\n"
    );
    assert.strictEqual(rg.findElectronVersion(dir), "v1.0.0");
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("scans nested files recursively", () => {
  const dir = tmpDir();
  try {
    const sub = path.join(dir, "deep", "nested");
    fs.mkdirSync(sub, { recursive: true });
    fs.writeFileSync(path.join(sub, "binary"), "...Electron v15.6.7...");
    assert.strictEqual(rg.findElectronVersion(dir), "v15.6.7");
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
