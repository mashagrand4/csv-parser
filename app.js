const yargs = require('yargs');
const fs = require('fs');

const options = yargs
    .usage("Usage: -sourceFile <sourceFile> -resultFile <resultFile> -separator <separator>")
    .option("sourceFile", { alias: "sourceFile", describe: "Source file path", type: "string", demandOption: true })
    .option("resultFile", { alias: "resultFile", describe: "Result file path", type: "string", demandOption: true })
    .option("separator", { alias: "separator", describe: "separator", type: "string", demandOption: true })
    .argv;

const path = options.sourceFile;

const fileToBuffer = (path) => {
    let readStream = fs.createReadStream(path);
    let chunks = [];

    readStream.on('error', err => {
        console.log(err);
        //return cb(err);
    });

    readStream.pipe(fs.createWriteStream('copy.csv')).on('data', chunk => {
        //console.log(chunk.toString());
    });

    readStream.on('close', () => {
        console.log(readStream);
        //console.log(chunks.toString());
        //return cb(null, Buffer.concat(chunks));
    });
};

fileToBuffer(path);