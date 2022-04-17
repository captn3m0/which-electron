const E = require('elfinfo')
const fs = require('fs')

// Parse the specified ELF file.
const path ='../aur-notable/notable'
const elfdata = fs.readFileSync(path);
let info = null
E.open(elfdata).then((info)=>{
  let rodata = info.elf.sections.filter((x)=>{return x.name=='.rodata'})[0]

  const data = fs.createReadStream(path, {
    start: Number(rodata.addr),
    end: Number(rodata.addr) + rodata.size,
    highWaterMark: rodata.addralign
  })

    data.on('data', function(data){
    let found = data.toString().match(/Electron\/(\d+\.\d+\.\d+)/)
    if(found) {
      console.log(found[1])
    }
  });
})






