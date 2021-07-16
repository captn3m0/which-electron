# which-electron ![](https://img.shields.io/badge/Status-WIP-orange)

Try to find out which Electron version is bundled inside an application.

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

$ which-electron Google.Play.Music.Desktop.Player.deb
```

## How does it work?

We attempt multiple pathways:

1. The presence of a `electron.asar` file denotes an electron version `<v7.0.0`, since later releases dropped that file and embedded it in the binary instead.
2. A `version` text file is sometimes included in the final binary.
3. The `node_modules/electron/package.json` file is sometimes present.
4. A lookup table of [hashes from various electron releases](https://github.com/captn3m0/electron-fingerprints/) is used to guess the version. (WIP)
5. Get the electron version from the electron binary (WIP)

Note that this can be run against untrusted binaries as it does not _try to run the application_.

## License

Licensed under the [MIT License](https://nemo.mit-license.org/). See LICENSE file for details.
