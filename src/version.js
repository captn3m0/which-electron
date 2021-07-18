const semverSort = require('semver-sort');
const VERSIONS = require('./versions')

module.exports = {
  asText: function(listOfVersions) {
    sorted = semverSort.asc(listOfVersions);
    return `${sorted[0]}-${sorted[sorted.length-1]}`
  },

  max: function(listOfVersions) {
    sorted = semverSort.asc(listOfVersions);
    return sorted[sorted.length-1];
  },

  isSupported: function(v) {
    return (VERSIONS['supported'].indexOf(v) !== -1)
  }
}
