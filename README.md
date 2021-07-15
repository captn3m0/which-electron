# which-electron

Try to find out which Electron version is bundled in an application file.

## how

The script attempts to extract the `app.asar` file and get the electron version from the manifest there.

## supported files

Currently supports:

1. Zip Files