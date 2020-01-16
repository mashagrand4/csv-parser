const yargs = require('yargs');
const fs = require('fs');
const OPTIONS = require('./constants');
const createMyStream = require('./helpers/transformStreamCreator');

const options = yargs
    .usage("Usage: -sourceFile <sourceFile> /n -resultFile <resultFile> /n -separator <separator>")
    .options(OPTIONS)
    .argv;

let readStream = fs.createReadStream(options.sourceFile);
let writeStream = fs.createWriteStream(options.resultFile);
let myStream = createMyStream();

readStream
    .pipe(myStream)
    .pipe(writeStream);