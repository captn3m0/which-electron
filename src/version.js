const semver = require("semver");
const VERSIONS = require("./versions");

module.exports = {
  asText: function (listOfVersions) {
    sorted = listOfVersions.sort(semver.compare);
    return `${sorted[0]}-${sorted[sorted.length - 1]}`;
  },

  max: function (listOfVersions) {
    sorted = listOfVersions.sort(semver.compare);
    return sorted[sorted.length - 1];
  },

  isSupported: function (v) {
    return VERSIONS["supported"].indexOf(v) !== -1;
  },
};
