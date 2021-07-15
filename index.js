const path = require("path");
const osguess = require("./os");
const finder = require("./finder");
const zip = require("./zip");

// Input file comes from process.argv[2]
const FILENAME = process.argv[2];

zip.listFileContents(FILENAME, (entries)=> {
  let asar = finder.asar(entries);
  let binary = finder.binary(entries);
  let versionFiles = finder.version(entries);
  let enm = finder.findElectronPackageInsideNodeModules(entries);
  // if (asar.length > 0) {
  //   asar.forEach((a) => {
  //     console.log(`${process.argv[2]}:${a}`);
  //   });
  // }
  // if (binary) {
  //   console.log(`${process.argv[2]}:${binary}`);
  // }
  if (versionFiles.length > 0) {
    versionFiles.map((f) => {
      zip.readFileContents(FILENAME, f, (c)=>console.log(c))
    });
  }
  // if (enm) {
  //   enm.forEach((a) => {
  //     zip.readFileContents(FILENAME, a, (c)=>console.log(c))
  //   });
  // }
});
