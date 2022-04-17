import semver from "semver";
import VERSIONS from "./versions.json" assert { type: "json" };

export function asText(listOfVersions) {
  sorted = listOfVersions.sort(semver.compare);
  return `${sorted[0]}-${sorted[sorted.length - 1]}`;
}

export function max(listOfVersions) {
  sorted = listOfVersions.sort(semver.compare);
  return sorted[sorted.length - 1];
}
export function isSupported(v) {
  return VERSIONS["supported"].indexOf(v) !== -1;
}
