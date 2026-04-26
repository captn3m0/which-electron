const osguess = require("./os");
const finder = require("./finder");
const archive = require("./archive");
const fp = require("./fingerprint");
const rg = require("./rg");
const V = require("./version");

const isUrl = require("is-valid-http-url");
const cleanup = require("rimraf");
const Downloader = require("nodejs-file-downloader");

const path = require("path");
const fs = require("fs");
const os = require("os");

const args = process.argv.slice(2);
const JSON_MODE = args.includes("--json");
const FILENAME = args.find((a) => !a.startsWith("--"));

const log = (msg) => { if (!JSON_MODE) console.log(msg); };

if (!FILENAME) {
  console.error("Please pass a valid URL or file as the first argument");
  process.exit(1);
}

// Promise wrappers around archive.js's stream-callback API.
const listEntries = (file) =>
  new Promise((resolve) => archive.listFileContents(file, resolve));
const extractFiles = (file, list, dir) =>
  list.length
    ? new Promise((resolve) => archive.extractSomeFiles(file, list, dir, resolve))
    : Promise.resolve();
const extractAll = (file, dir) =>
  new Promise((resolve) => archive.extractSomeFiles(file, [], dir, resolve));
const readFile = (file, fp, dir) =>
  new Promise((resolve) => archive.readFileContents(file, fp, dir, resolve));

const METHOD_PRIORITY = ["rg", "version_file", "package_json", "fingerprint", "asar"];

async function whichElectron(filename) {
  const TMPDIR = fs.mkdtempSync(path.join(os.tmpdir(), "which-electron-"));
  const result = { file: filename, os: null, arch: null, signals: [] };

  const addSignal = (method, version, extra) => {
    const s = { method };
    if (version) {
      s.version = version;
      s.supported = V.isSupported(version);
    }
    if (extra) Object.assign(s, extra);
    result.signals.push(s);
  };

  try {
    const entries = await listEntries(filename);

    const osFromName = osguess.guessFromFilename(filename);
    const osFromContents = osguess.guessFromContents(entries);
    if (osFromName && osFromContents && osFromName !== osFromContents) {
      log(`Unsure about operating system. Going with ${osFromContents}. Other option was ${osFromName}`);
    }
    result.os = osFromContents || osFromName || null;
    result.arch = osguess.guessArch(filename, entries) || null;

    const binary = finder.binary(entries);
    const versionFiles = finder.version(entries);
    const enm = finder.findElectronPackageInsideNodeModules(entries) || [];
    const asarFiles = finder.asar(entries);

    // Phase 1: get the framework binary (or its containing layer) on disk
    // and rg-scan it. When `binary` is undefined we have a nested archive
    // (tar.gz, tar.bz2, etc.) — 7z's `list` only sees the outer wrapper,
    // so we extract everything to surface the inner tar in TMPDIR. The
    // tar's member-file bytes are concatenated verbatim, so the literal
    // is still findable without recursing further.
    if (binary) await extractFiles(filename, [binary], TMPDIR);
    else await extractAll(filename, TMPDIR);
    const rgHit = rg.findElectronVersion(TMPDIR);
    if (rgHit) addSignal("rg", rgHit);

    // Sibling signals: cheap and may corroborate.
    await Promise.all([
      ...versionFiles.map(async (f) => {
        const c = await readFile(filename, f, TMPDIR);
        addSignal("version_file", `${c}`.trim());
      }),
      ...enm.map(async (pkgPath) => {
        const c = await readFile(filename, pkgPath, TMPDIR);
        try {
          const data = JSON.parse(c);
          if (data.version) addSignal("package_json", `v${data.version}`);
        } catch (_) {}
      }),
    ]);

    if (asarFiles.length) addSignal("asar", null, { constraint: "<v7.0.0" });

    // Phase 2: fingerprint fallback only when rg didn't fire — saves
    // extracting ~150-250MB of helpers/.dylibs/snapshots on the happy path.
    if (!rgHit) {
      const filesToHash = finder.fingerprintable(entries).filter(
        (f) => !fs.existsSync(path.join(TMPDIR, path.basename(f)))
      );
      await extractFiles(filename, filesToHash, TMPDIR);
      const guesses = fp.guessFromHashes(result.os, result.arch, fp.getHashes(TMPDIR));
      if (guesses.length === 1) addSignal("fingerprint", guesses[0]);
      else if (guesses.length > 1) addSignal("fingerprint", V.max(guesses), { candidates: guesses });
    }

    const primary = METHOD_PRIORITY
      .map((m) => result.signals.find((s) => s.method === m && s.version))
      .find(Boolean);
    if (primary) {
      result.version = primary.version;
      result.method = primary.method;
      result.supported = primary.supported;
    }

    if (JSON_MODE) {
      process.stdout.write(JSON.stringify(result, null, 2) + "\n");
    } else {
      printText(result);
    }
  } finally {
    cleanup.sync(TMPDIR);
  }
}

function printText(r) {
  for (const s of r.signals) {
    if (s.method === "rg") log(`Found via rg: ${s.version}`);
    else if (s.method === "fingerprint") log(`Fingerprint: ${s.candidates ? V.asText(s.candidates) : s.version}`);
    else if (s.method === "version_file") log(`Found Version file: ${s.version}`);
    else if (s.method === "package_json") log(`Found version in package.json file: ${s.version.replace(/^v/, "")}`);
    else if (s.method === "asar") log(`Version Constraint (Unsupported): ${s.constraint}`);
    if (s.version) log(`${s.version} is currently ${s.supported ? "" : "not "}supported`);
  }
}

async function main() {
  let target = FILENAME;
  if (isUrl(target)) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "which-electron-dl-"));
    await new Downloader({ url: FILENAME, directory: dir }).download();
    target = path.join(dir, path.basename(FILENAME));
    log(`Downloaded ${FILENAME}`);
  }
  try {
    await fs.promises.access(target, fs.constants.R_OK);
  } catch {
    console.error(`${target} not readable`);
    process.exit(1);
  }
  log(target);
  await whichElectron(target);
}

main().catch((e) => {
  if (JSON_MODE) {
    process.stdout.write(JSON.stringify({ file: FILENAME, error: e.message || String(e) }, null, 2) + "\n");
  } else {
    console.error(e);
  }
  process.exit(1);
});
