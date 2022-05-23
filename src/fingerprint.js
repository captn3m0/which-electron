import DB from "@captn3m0/electron-fingerprints";
import fs from "fs";
import hasha from "hasha";
import crypto from "crypto";

import V from "./versions.json" assert { type: "json" };
const allVersions = V["all"];

function checksumFile(algorithm, path) {
  return new Promise(function (resolve, reject) {
    let hash = crypto.createHash(algorithm).setEncoding("hex");
    fs.createReadStream(path)
      .once("error", reject)
      .pipe(hash)
      .once("finish", function () {
        resolve(hash.read());
      });
  });
}

export function guessFromHashes(os, arch, hashList) {
  let lookupTable = DB[`${os}-${arch}`];
  let allPossibleHashes = Object.keys(lookupTable);
  const intersectingHashes = allPossibleHashes.filter((value) =>
    hashList.includes(value)
  );
  // Set it to the starting list of versions.
  let possibleVersions = allVersions;
  for (let i in hashList) {
    let hash = hashList[i];
    let versions = lookupTable[hash];
    if (versions) {
      possibleVersions = possibleVersions.filter((value) =>
        versions.includes(value)
      );
    }
  }

  if (possibleVersions == allVersions) {
    return [];
  } else {
    return possibleVersions;
  }
}

export function getHashes(dir) {
  let list = fs.readdirSync(dir);
  return list.map((f) => {
    let fn = `${dir}/${f}`;
    return hasha.fromFileSync(fn, { algorithm: "sha1" });
  });
}
