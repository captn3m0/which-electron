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
    entries = entries.sort((a, b) => b.size - a.size);
    for (const entry of entries) {
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
    return entries
      .filter((e) => {
        return isDirectory(e.attributes) == false && path.basename(e.file) == "version";
      })
      .map((e) => e.file);
  },

  findElectronPackageInsideNodeModules: function(entries) {
    return entries
      .filter((e) => {
        return isDirectory(e.attributes) == false && e.file.match(/node_modules\/electron\/package\.json$/);
      })
      .map((e) => e.file);
  },

  // Return a list of files that might be worth fingerprinting
  fingerprintable: function(entries) {
    return entries.filter((e) =>{
      if (isDirectory(e.attributes)) {
        return false;
      }
      if (!e.file) {
        return false;
      }
      let ext = path.extname(e.file);
      if (['.h', '.dll', '.bin', '.asar', '.dylib', '.so', '.exe'].indexOf(ext) !== -1) {
        return true
      }
      let b = path.basename(e.file);

      if (['electron framework', 'squirrel', 'electron', 'electron helper', 'chrome_100_percent', 'chrome_200_percent'].indexOf(b)!== -1) {
        return true;
      }

      return false;
    })
    .map((e)=>e.file)
  }
};
