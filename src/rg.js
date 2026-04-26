const { spawnSync } = require("child_process");
const { rgPath } = require("@vscode/ripgrep");

const PATTERN = "Electron v[0-9]+\\.[0-9]+\\.[0-9]+";

// Scan a file (or dir) for the literal `Electron v<semver>` baked into the
// framework binary by electron::GetElectronVersion(). Returns "vX.Y.Z" or null.
module.exports.findElectronVersion = function (target) {
  const res = spawnSync(
    rgPath,
    ["-aoNI", "--no-heading", "--no-filename", PATTERN, target],
    { encoding: "utf8", maxBuffer: 1 * 1024 * 1024 }
  );
  const m = res.stdout && res.stdout.match(/Electron v(\d+\.\d+\.\d+)/);
  return m ? `v${m[1]}` : null;
};
