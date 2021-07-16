const fs = require("fs");
entries = {};

module.exports = {
  getEntries: function(f) {
    if (entries[f]) {
      return entries[f];
    } else {
      return (entries[f] = JSON.parse(
        fs.readFileSync(`./tests/fixtures/${f}.json`)
      ));
    }
  },
};
