const path = require("path");
const zip = require("../zip");
const fs = require('fs')

const FILENAME = process.argv[2];

zip.listFileContents(FILENAME, (entries)=> {
  fs.writeFileSync(`./tests/fixtures/${path.basename(FILENAME)}.json`, JSON.stringify(entries))
});
