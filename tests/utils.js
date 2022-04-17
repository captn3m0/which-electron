import fs from "fs";
let entries = {};

export function getEntries(f) {
  if (entries[f]) {
    return entries[f];
  } else {
    return (entries[f] = JSON.parse(
      fs.readFileSync(`./tests/fixtures/${f}.json`)
    ));
  }
}
