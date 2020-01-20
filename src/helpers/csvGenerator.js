import fs from "fs";

const csvGenerator = (sourcePath, resultPath) => {
    return new Promise((resolve, reject) => {
        let readStream = fs.createReadStream(sourcePath);
        let writeStream = fs.createWriteStream(resultPath, {flags: 'a'});

        for (let i = 0; i < 10000; i++) {
            readStream.pipe(writeStream);
        }

        writeStream.on('close', () => {
            resolve("success");
        });
    });
};

export default csvGenerator;