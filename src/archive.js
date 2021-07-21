const Seven = require("node-7z");
const which = require('which');
const path = require("path");
const fs = require("fs");

let sevenBin = null;

try {
  sevenBin = which.sync('7z')
} catch(e) {
  sevenBin = require('7zip-bin').path7za
  console.error("Couldn't find 7-zip installed. Using the 7zip-bin package, which uses an older version of 7-zip. Not all files may work properly.")
}

module.exports = {
  readFileContents: function(archive, filepath, dir, cb) {
    let stream = Seven.extract(archive, dir, {
      recursive: true,
      $cherryPick: filepath,
      $bin: sevenBin
    });
    let fn = path.basename(filepath);
    stream.on("end", ()=>{
      cb(fs.readFileSync(`${dir}/${fn}`, {encoding: 'utf8'}))
    });
  },
  extractSomeFiles: function(archive, list, dir, cb) {
    let stream = Seven.extract(archive, dir, {
      $cherryPick: list,
      $bin: sevenBin
    })
    stream.on('end', ()=>{
      cb()
    })
  },
  listFileContents: function(archive, cb) {
    let zip = Seven.list(archive, {
      $bin: sevenBin,
      alternateStreamExtract: true,
      alternateStreamReplace: true,
    });
    let entries = [];
    zip.on("data", (data) => {
      entries.push(data);
    });
    zip.on("end", () => {
      cb(entries);
    });
  },
};
