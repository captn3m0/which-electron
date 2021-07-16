// Guess the OS

const path = require('path')

module.exports = {
	guessFromFilename(inputFile) {
		let fn = path.basename(inputFile)
		if (fn.match(/linux/)) {
			return 'linux'
		} else if (fn.match(/mac/)) {
			return 'darwin'
    } else if (fn.match(/darwin/)) {
      return 'darwin'
		} else if (fn.match(/win/)) {
			return 'win32'
		} else {
			ext = path.extname(inputFile)
			if (ext.match(/dmg/)) {
				return 'darwin'
			} else if (ext.match('/exe/')) {
				return 'win32'
			} else if (ext.match(/deb/) ||ext.match(/appimage/i) || ext.match(/pacman/)) {
        return 'linux'
      }
		}
		return null;
	},
  guessArch(filename, entries) {
    return 'x64';
  },
	guessFromContents(entries) {
		for (i in entries) {
      let entry = entries[i]
			if (path.extname(entry.file) == ".so") {
				return 'linux'
			} else if (path.extname(entry.file) == '.dll') {
				return 'win32'
			} else if (path.extname(entry.file) == '.dylib') {
				return 'darwin'
			} else if (path.extname(entry.file) == '.plist') {
				return 'darwin'
			}
		}
	}
}
