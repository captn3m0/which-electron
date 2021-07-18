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
			let ext = path.extname(inputFile).toLowerCase()
      if (ext == '.dmg') {return 'darwin'}
      if (ext == '.exe') {return 'win32'}
      if (['.deb', '.appimage', '.pacman'].indexOf(ext) !== -1) {
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
