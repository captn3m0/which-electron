const path = require("path");
const osguess = require("./os");
const finder = require("./finder");
const zip = require("./zip");
const fp = require('./fingerprint')

// Input file comes from process.argv[2]
const FILENAME = process.argv[2];

console.log(FILENAME)

zip.listFileContents(FILENAME, (entries)=> {
  let asar = finder.asar(entries);
  let binary = finder.binary(entries);
  let versionFiles = finder.version(entries);
  let enm = finder.findElectronPackageInsideNodeModules(entries);

  let filesToHash = finder.fingerprintable(entries)

  zip.extractSomeFiles(FILENAME, filesToHash, (dir)=>{
    hashes = fp.getHashes(dir)
    guesses = fp.guessFromHashes('win32', 'x64', hashes)
    if (guesses.length == 1) {
      console.log("Fingerprint: " + guesses[0])
    } else {
      console.log("Multiple guesses from fingerprinting:")
      console.log(guesses)
    }
  })

  // if (binary) {
  //   console.log(`${process.argv[2]}:${binary}`);
  // }
  if (versionFiles.length > 0) {
    versionFiles.map((f) => {
      zip.readFileContents(FILENAME, f, (c)=>{
        console.log("Found Version file: v" + c)
      })
    });
  }
  if (asar.length > 0) {
    asar.forEach((a) => {
      console.log("Version Constraint: <v7.0.0")
    });
  }
  if (enm) {
    enm.forEach((a) => {
      zip.readFileContents(FILENAME, a, (c)=>{
        try {
          let packageData = JSON.parse(c)
          console.log("Found version in package.json file: " + packageData['version'])
        }catch(e){
          // TODO: Do something
        }
      })
    });
  }
});
