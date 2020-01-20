import yargs from 'yargs';
import fs from 'fs';
import OPTIONS from './constants';
import TransformStreamToParse from './helpers/transformStreamToParse';
import csvGenerator from "./helpers/csvGenerator";

const options = yargs
    .usage("Usage: -sourceFile <sourceFile> /n -resultFile <resultFile> /n -separator <separator>")
    .options(OPTIONS)
    .argv;

let readStream = fs.createReadStream(options.sourceFile);
let writeStream = fs.createWriteStream(options.resultFile);
let myStream = new TransformStreamToParse();

readStream
    .pipe(myStream)
    .pipe(writeStream);

csvGenerator(options.sourceFile, "src/files/big.csv");

