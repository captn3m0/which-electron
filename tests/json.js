const test = require("kuta").test;
const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const assert = require("assert");
const sevenBin = require("7zip-bin").path7za;

const CLI = path.join(__dirname, "..", "src", "index.js");

function makeZip(setup) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "we-json-test-"));
  setup(dir);
  const zipPath = path.join(dir, "fixture.zip");
  // Pack everything in `dir` (except the zip itself, which doesn't exist yet)
  // into the zip, with paths relative to dir.
  execFileSync(
    sevenBin,
    ["a", "-bso0", "-bsp0", "-tzip", zipPath, path.join(dir, "*")],
    { cwd: dir }
  );
  return { dir, zipPath };
}

function runCli(zipPath) {
  const out = execFileSync("node", [CLI, zipPath, "--json"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return JSON.parse(out);
}

function cleanup(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

test("--json: emits a parseable object with the expected fields", () => {
  const { dir, zipPath } = makeZip((d) => {
    const pad = Buffer.alloc(4096, 0x55);
    fs.writeFileSync(
      path.join(d, "myapp"),
      Buffer.concat([pad, Buffer.from("Electron v8.7.6\0"), pad])
    );
  });
  try {
    const r = runCli(zipPath);
    assert.strictEqual(r.file, zipPath);
    assert.strictEqual(r.version, "v8.7.6");
    assert.strictEqual(r.method, "rg");
    assert.strictEqual(typeof r.supported, "boolean");
    assert.ok(Array.isArray(r.signals));
    assert.strictEqual(r.signals.length, 1);
    assert.strictEqual(r.signals[0].method, "rg");
    assert.strictEqual(r.signals[0].version, "v8.7.6");
  } finally {
    cleanup(dir);
  }
});

test("--json: rg wins over a sibling version_file in the same archive", () => {
  // Both detection paths fire; primary should be rg per METHOD_PRIORITY,
  // but signals[] should contain both.
  const { dir, zipPath } = makeZip((d) => {
    fs.writeFileSync(path.join(d, "myapp"), "...Electron v3.3.3...");
    fs.writeFileSync(path.join(d, "version"), "v4.4.4\n");
  });
  try {
    const r = runCli(zipPath);
    assert.strictEqual(r.method, "rg");
    assert.strictEqual(r.version, "v3.3.3");
    const methods = r.signals.map((s) => s.method).sort();
    assert.deepStrictEqual(methods, ["rg", "version_file"]);
    const vf = r.signals.find((s) => s.method === "version_file");
    assert.strictEqual(vf.version, "v4.4.4");
  } finally {
    cleanup(dir);
  }
});

test("--json: emits no signals and no version when nothing detects", () => {
  // A zip with one file that holds no Electron literal and no version file.
  const { dir, zipPath } = makeZip((d) => {
    fs.writeFileSync(path.join(d, "binary"), "this is not an electron app");
  });
  try {
    const r = runCli(zipPath);
    assert.deepStrictEqual(r.signals, []);
    assert.strictEqual(r.version, undefined);
    assert.strictEqual(r.method, undefined);
  } finally {
    cleanup(dir);
  }
});
