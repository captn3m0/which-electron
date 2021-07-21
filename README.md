# which-electron ![](https://img.shields.io/badge/Status-Beta-orange) ![npm](https://img.shields.io/npm/v/which-electron) ![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/which-electron) ![NPM](https://img.shields.io/npm/l/which-electron)

Find out which Electron version is bundled inside an application.

## Usage

```shell
$ npm install which-electron

$ which-electron Google.Play.Music.Desktop.Player.OSX.zip
Version Constraint (Unsupported): <v7.0.0
Fingerprint: v3.1.7-v3.1.8
v3.1.8 is currently not supported

$ which-electron HashTag-win32-x64.zip
Found Version file: v7.1.10
v7.1.10 is currently not supported
Fingerprint: v7.1.10
v7.1.10 is currently not supported

$ which-electron Appium-linux-1.21.0.AppImage
Fingerprint: v7.2.4-v7.3.3
v7.3.3 is currently not supported

$ which-electron https://github.com/stoplightio/studio/releases/download/v2.3.0-stable.5931.git-67616e9/stoplight-studio-mac.dmg
Downloaded https://github.com/stoplightio/studio/releases/download/v2.3.0-stable.5931.git-67616e9/stoplight-studio-mac.dmg
/tmp/which-electronaN3QGg/stoplight-studio-mac.dmg
Fingerprint: v11.0.5-v11.1.1
v11.1.1 is currently not supported
```

## How does it work?

We attempt multiple pathways:

1. The presence of a `electron.asar` file denotes an electron version `<v7.0.0`, since later releases dropped that file and embedded it in the binary instead.
2. A `version` text file is sometimes included in the final binary.
3. The `node_modules/electron/package.json` file is sometimes present.
4. A lookup table of [hashes from various electron releases](https://github.com/captn3m0/electron-fingerprints/) is used to guess the version. In case of multiple matches, it returns a range of versions.
5. Get the electron version from the electron binary (WIP)

Note that this can be run against untrusted binaries as it does not _try to run the application_. It has been tested against various file formats: zip/dmg/exe/AppImage/tar.gz etc. It extracts limited files using 7-zip to a temporary directory at runtime if needed.

## Known Issues

It is known to not work against:

1. Windows setup files (ones with `-setup` in their name)
2. On systems without 7-zip installed, it falls back to an older version of 7zip via the 7z-bin package on NPM. Unfortunately, the older version can't extract AppImage files correctly.

## License

Licensed under the [MIT License](https://nemo.mit-license.org/). See LICENSE file for details.
