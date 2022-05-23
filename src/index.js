const osguess = require("./os");
const finder = require("./finder");
const archive = require("./archive");
const fp = require("./fingerprint");
const V = require("./version");
const elf = require("./elf");
const magic = require("file-identity");

const isUrl = require("is-valid-http-url");
const cleanup = require("rimraf");
const dl = require("nodejs-file-downloader");

const path = require("path");
const fs = require("fs");
const os = require("os");
const process = require("process");
const TMPDIR = path.join(os.tmpdir(), "which-electron");

// Input file comes from process.argv[2]
let FILENAME = process.argv[2];

if (!FILENAME) {
  console.error("Please pass a valid URL or file as the first argument");
  process.exit(1);
}

if (isUrl(FILENAME)) {
  let url = FILENAME;
  // Download to temporary directory
  let tmpdir = fs.mkdtempSync(TMPDIR);
  let fn = `${tmpdir}/${path.basename(url)}`;
  const downloader = new dl({
    url: url,
    directory: tmpdir, //This folder will be created, if it doesn't exist.
  });
  downloader
    .download()
    .then(() => {
      console.log(`Downloaded ${url}`);
      validateFile(fn);
    })
    .catch((e) => {
      console.error(`Error while downloading ${url}`);
      console.error(e);
      process.exit(1);
    });
} else {
  validateFile(FILENAME);
}

function validateFile(fn) {
  fs.access(fn, fs.constants.R_OK, (err) => {
    if (err) {
      console.error(`${fn} not readable`);
      process.exit(1);
    } else {
      console.log(fn);
      whichElectron(fn);
    }
  });
}

function logSupport(version) {
  if (V.isSupported(version)) {
    console.log(`${version} is currently supported`);
  } else {
    console.log(`${version} is currently not supported`);
  }
}

let whichElectron = function (filename) {
  archive.listFileContents(filename, (entries) => {
    let osguess1 = osguess.guessFromFilename(filename);
    let osguess2 = osguess.guessFromContents(entries);

    if (osguess1 !== osguess2 && osguess1 && osguess2) {
      console.log(
        `Unsure about operating system. Going with ${osguess2}. Other option was ${osguess1}`
      );
    }
    if (osguess1 && !osguess2) {
      osguess2 = osguess1;
    }
    let arch = osguess.guessArch(filename, entries);
    let asar = finder.asar(entries);
    let binaries = finder.binaries(entries);
    let versionFiles = finder.version(entries);
    let enm = finder.findElectronPackageInsideNodeModules(entries);

    let filesToHash = finder.fingerprintable(entries);

    archive.extractSomeFiles(
      filename,
      filesToHash.concat(binaries),
      TMPDIR,
      () => {
        hashes = fp.getHashes(TMPDIR);
        guesses = fp.guessFromHashes(osguess2, arch, hashes);
        if (guesses.length == 1) {
          console.log("Fingerprint: " + guesses[0]);
          logSupport(guesses[0]);
        } else if (guesses.length > 1) {
          console.log("Fingerprint: " + V.asText(guesses));
          logSupport(V.max(guesses));
        }

        if (binaries.length > 0) {
          for (i in binaries) {
            let binary = binaries[i];
            let type = magic.fromFile(`${TMPDIR}/${binary}`);
            if (type) {
              console.log(type);
            } else {
              console.log(fs.existsSync(`${TMPDIR}/${binary}`));
            }
          }
        }

        cleanup.sync(TMPDIR);
      }
    );

    if (versionFiles.length > 0) {
      versionFiles.map((f) => {
        archive.readFileContents(filename, f, TMPDIR, (c) => {
          console.log("Found Version file: " + c);
          logSupport(`${c}`);
        });
      });
    }
    if (asar.length > 0) {
      asar.forEach((a) => {
        console.log("Version Constraint (Unsupported): <v7.0.0");
      });
    }
    if (enm) {
      enm.forEach((a) => {
        archive.readFileContents(filename, a, (c) => {
          try {
            let packageData = JSON.parse(c);
            console.log(
              "Found version in package.json file: " + packageData["version"]
            );
            logSupport(`v${packageData["version"]}`);
          } catch (e) {
            // TODO: Do something
          }
        });
      });
    }
  });
};
