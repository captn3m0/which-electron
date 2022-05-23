import { list, extract } from "node-7z";
import which from "which";
import path from "path";
import fs from "fs";

let sevenBin = null;

try {
  sevenBin = which.sync("7z");
} catch (e) {
  import { path7za } from "7zip-bin";
  console.error(
    "Couldn't find 7-zip installed. Using the 7zip-bin package, which uses an older version of 7-zip. Not all files may work properly."
  );
}

export function readFileContents(archive, filepath, dir, cb) {
  let stream = extract(archive, dir, {
    recursive: true,
    $cherryPick: filepath,
    $bin: sevenBin,
  });
  let fn = path.basename(filepath);
  stream.on("end", () => {
    cb(fs.readFileSync(`${dir}/${fn}`, { encoding: "utf8" }));
  });
}
export function extractSomeFiles(archive, list, dir, cb) {
  let stream = extract(archive, dir, {
    $cherryPick: list,
    $bin: sevenBin,
  });
  stream.on("end", () => {
    cb();
  });
}
export function listFileContents(archive, cb) {
  let zip = list(archive, {
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
}
