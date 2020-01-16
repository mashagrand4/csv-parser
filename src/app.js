import yargs from 'yargs';
import fs from 'fs';
import OPTIONS from './constants';
import TransformStreamCreator from './helpers/transformStreamCreator';

const options = yargs
    .usage("Usage: -sourceFile <sourceFile> /n -resultFile <resultFile> /n -separator <separator>")
    .options(OPTIONS)
    .argv;

let readStream = fs.createReadStream(options.sourceFile);
let writeStream = fs.createWriteStream(options.resultFile);
let myStream = new TransformStreamCreator();

readStream
    .pipe(myStream)
    .pipe(writeStream);