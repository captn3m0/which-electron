const Seven = require("node-7z");
const path = require("path");
const osguess = require("./os");
const finder = require("./finder");
// Input file comes from process.argv[2]

const FILENAME = process.argv[2];
console.log(FILENAME)
const zip = Seven.list(FILENAME);
entries = [];
zip.on("data", (data) => {
  entries.push(data);
});

zip.on("end", () => {
  let asar = finder.asar(entries);
  let binary = finder.binary(entries);
  let versionFiles = finder.version(entries);
  let enm = finder.findElectronPackageInsideNodeModules(entries);
  if (asar.length > 0) {
    asar.forEach((a) => {
      console.log(`${process.argv[2]}:${a}`);
    });
  }
  if (binary) {
    console.log(`${process.argv[2]}:${binary}`);
  }
  if (versionFiles.length > 0) {
    versionFiles.forEach((a) => {
      console.log(`${process.argv[2]}:${a}`);
    });
  }
  if (enm) {
    enm.forEach((a) => console.log(`${process.argv[2]}:${a}`));
  }
});
