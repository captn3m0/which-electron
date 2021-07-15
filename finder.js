// finds specific files from a list
const path = require("path");
const isDirectory = require('./utils').isDirectory;

module.exports = {
  // Finds the electron asar file, if we can
  asar: function(entries) {
    return entries
      .filter((e) => {
        return (
          isDirectory(e.attributes) == false &&
          path.basename(e.file) == "electron.asar"
        );
      })
      .map((e) => e.file);
  },
  binary: function(entries) {
    entries = Object.values(entries).sort((a, b) => b.size - a.size);
    for (const entry of Object.values(entries)) {
      if (isDirectory(entry.attributes)) {
        continue;
      }
      let ext = path.extname(entry.file);
      let size = entry.size;
      // Return the first exe file
      if (ext == ".exe") {
        return entry.file;
      } else if (ext == "") {
        // or the largest file with no extension
        return entry.file;
      }
    }
  },

  version: function(entries) {
    return Object.values(entries)
      .filter((e) => {
        return isDirectory(e.attributes) == false && path.basename(e.file) == "version";
      })
      .map((e) => e.file);
  },

  findElectronPackageInsideNodeModules: function(entries) {
    return Object.values(entries)
      .filter((e) => {
        return isDirectory(e.attributes) == false && e.file.match(/node_modules\/electron\/package\.json$/);
      })
      .map((e) => e.file);
  }
};
