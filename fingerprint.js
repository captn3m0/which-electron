const DB = require("electron-fingerprints");

module.exports = {
  guessFromHashes: function(os, arch, hashList) {
    let lookupTable = DB[`${os}-${arch}`]
    let allPossibleHashes = Object.keys(lookupTable)
    const intersectingHashes = allPossibleHashes.filter((value) =>
      hashList.includes(value)
    );
    // Set it to the starting list of versions.
    let possibleVersions = lookupTable[intersectingHashes[0]];
    for (i in hashList) {
      let hash = hashList[i];
      let versions = lookupTable[hash];
      possibleVersions = possibleVersions.filter((value) =>
        versions.includes(value)
      );
    }

    return possibleVersions;
  },
};
