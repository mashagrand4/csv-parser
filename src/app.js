import yargs from 'yargs';
import fs from 'fs';
import OPTIONS from './constants/params';
import {TEMP_CSV_PATH} from './constants/other';
import TransformStreamToParse from './helpers/transformStreamToParse';
import csvGenerator from "./helpers/csvGenerator";
import authorize from "./apis/drive/authorize";
import {CREDENTIALS} from './constants/credentials';
import loadFile from "./apis/drive/loadFile";

const options = yargs
    .usage("Usage: -sourceFile <sourceFile> /n -resultFile <resultFile> /n -separator <separator>")
    .options(OPTIONS)
    .argv;

csvGenerator(options.sourceFile, TEMP_CSV_PATH).on('close', () => {
    let readStream = fs.createReadStream(TEMP_CSV_PATH);
    let writeStream = fs.createWriteStream(options.resultFile);
    let myStream = new TransformStreamToParse();

    readStream
        .pipe(myStream)
        .pipe(writeStream);

    writeStream.on("finish", () => {
        authorize(CREDENTIALS, (auth) => {
            loadFile(auth, {
                name: "parsed.json",
                mimeType: "application/json",
                path: options.resultFile
            }).catch(console.error);
        });
    });
});





















