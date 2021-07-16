const Seven = require("node-7z");
const path = require("path");
const fs = require("fs");

module.exports = {
  readFileContents: function(archive, filepath, cb) {
    // TODO: Create a new temp directory
    let stream = Seven.extract(archive, "/tmp", {
      recursive: true,
      $cherryPick: filepath,
    });
    let fn = path.basename(filepath);
    stream.on("end", ()=>{
      cb(fs.readFileSync(`/tmp/${fn}`, {encoding: 'utf8'}))
    });
  },
  extractSomeFiles: function(archive, list, cb) {
    let dir = fs.mkdtempSync('/tmp/which-electron')
    let stream = Seven.extract(archive, dir, {
      $cherryPick: list
    })
    stream.on('end', ()=>{
      cb(dir)
    })
  },
  listFileContents: function(archive, cb) {
    let zip = Seven.list(archive);
    let entries = [];
    zip.on("data", (data) => {
      entries.push(data);
    });
    zip.on("end", () => {
      cb(entries);
    });
  },
};
