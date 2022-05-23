import elfinfo from "elfinfo";
import fs from "fs";

// Parse the specified ELF file.
export function getVersion(path, cb) {
  const elfdata = fs.readFileSync(path);
  let info = null;
  elfinfo.open(elfdata).then((info) => {
    let rodata = info.elf.sections.filter((x) => {
      return x.name == ".rodata";
    })[0];

    const data = fs.createReadStream(path, {
      start: Number(rodata.addr),
      end: Number(rodata.addr) + rodata.size,
      highWaterMark: rodata.addralign,
    });

    let ret = false;

    data.on("data", function (data) {
      let found = data.toString().match(/Electron\/(\d+\.\d+\.\d+)/);
      if (found) {
        ret = true;
        cb(found[1]);
      }
    });

    data.on("end", function (e) {
      if (!ret) {
        cb(false);
      }
    });
  });
}
