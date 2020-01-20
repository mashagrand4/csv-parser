import fs from "fs";

const csvGenerator = (sourcePath, resultPath) => {
    let readStream = fs.createReadStream(sourcePath, { highWaterMark: 1024 * 1024 });
    let writeStream = fs.createWriteStream(resultPath, {flags: 'a'});

    readStream.on('data', (data) => {
            let lines = data.toString().split("\r");
            let headers = lines.shift();
            writeStream.write(Buffer.from(headers + "\n"));
            for(let i = 0; i < 10000; i++) {
                for(let j = 0; j < lines.length; j++) {
                    writeStream.write(Buffer.from(lines[j] + "\n"));
                }
            }
    });
};

export default csvGenerator;