import fs from "fs";

const csvGenerator = (sourcePath, resultPath) => {
    let readStream = fs.createReadStream(sourcePath, { highWaterMark: 1024 * 1024 });
    let writeStream = fs.createWriteStream(resultPath, { flags: 'w' });
    readStream.on('data', chunk => {
        const data = chunk.toString();
        const headersEnd = data.indexOf('\r');
        const headers = data.substring(0, headersEnd);
        const rows = data.substring(headersEnd);
        writeStream.write(headers);
        for (let i = 0; i < 1000; i++) {
            writeStream.write(rows);
        }
        writeStream.end();
    });
    return writeStream;
};

export default csvGenerator;