const DB = require("electron-fingerprints");
const fs = require("fs");
const hasha = require("hasha");
const allVersions = require("./versions")["all"];

function checksumFile(algorithm, path) {
  return new Promise(function(resolve, reject) {
    let fs = require("fs");
    let crypto = require("crypto");

    let hash = crypto.createHash(algorithm).setEncoding("hex");
    fs.createReadStream(path)
      .once("error", reject)
      .pipe(hash)
      .once("finish", function() {
        resolve(hash.read());
      });
  });
}

module.exports = {
  guessFromHashes: function(os, arch, hashList) {
    let lookupTable = DB[`${os}-${arch}`];
    let allPossibleHashes = Object.keys(lookupTable);
    const intersectingHashes = allPossibleHashes.filter((value) =>
      hashList.includes(value)
    );
    // Set it to the starting list of versions.
    let possibleVersions = allVersions;
    for (i in hashList) {
      let hash = hashList[i];
      let versions = lookupTable[hash];
      if (versions) {
        possibleVersions = possibleVersions.filter((value) =>
          versions.includes(value)
        );
      }
    }

    if (possibleVersions == allVersions) {
      return [];
    } else {
      return possibleVersions;
    }
  },

  getHashes: function(dir) {
    let list = fs.readdirSync(dir);
    return list.map((f) => {
      let fn = `${dir}/${f}`;
      return hasha.fromFileSync(fn, { algorithm: "sha1" });
    });
  },
};
