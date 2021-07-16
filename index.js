const path = require("path");
const osguess = require("./os");
const finder = require("./finder");
const zip = require("./zip");
const fp = require("./fingerprint");
const cleanup = require("rimraf");
const V = require("./version");

// Input file comes from process.argv[2]
const FILENAME = process.argv[2];

console.log(FILENAME);

function logSupport(version) {
  if (V.isSupported(version)) {
    console.log(`${version} is currently supported`);
  } else {
    console.log(`${version} is currently not supported`);
  }
}

zip.listFileContents(FILENAME, (entries) => {
  let osguess1 = osguess.guessFromFilename(FILENAME);
  let osguess2 = osguess.guessFromContents(entries);

  if (osguess1 !== osguess2 && osguess1 && osguess2) {
    console.log(`Unsure about operating system. Going with ${osguess2}. Other option was ${osguess1}`);
  }
  if (osguess1 && !osguess2) {
    osguess2 = osguess1
  }
  let arch = osguess.guessArch(FILENAME, entries);
  let asar = finder.asar(entries);
  let binary = finder.binary(entries);
  let versionFiles = finder.version(entries);
  let enm = finder.findElectronPackageInsideNodeModules(entries);

  let filesToHash = finder.fingerprintable(entries);

  zip.extractSomeFiles(FILENAME, filesToHash, (dir) => {
    hashes = fp.getHashes(dir);
    guesses = fp.guessFromHashes(osguess2, arch, hashes);
    if (guesses.length == 1) {
      console.log("Fingerprint: " + guesses[0]);
      logSupport(guesses[0])
    } else if (guesses.length > 1) {
      console.log("Fingerprint: " + V.asText(guesses));
      logSupport(V.max(guesses))
    }

    cleanup.sync(dir);
  });

  // if (binary) {
  //   console.log(`${process.argv[2]}:${binary}`);
  // }
  if (versionFiles.length > 0) {
    versionFiles.map((f) => {
      zip.readFileContents(FILENAME, f, (c) => {
        console.log("Found Version file: " + c);
        logSupport(`${c}`)
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
      zip.readFileContents(FILENAME, a, (c) => {
        try {
          let packageData = JSON.parse(c);
          console.log(
            "Found version in package.json file: " + packageData["version"]
          );
          logSupport(`v${packageData["version"]}`)
        } catch (e) {
          // TODO: Do something
        }
      });
    });
  }
});
