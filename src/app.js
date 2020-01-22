import yargs from 'yargs';
import http from 'http';
const {google} = require('googleapis');
import fs from 'fs';
import OPTIONS from './constants/params';
import {TEMP_CSV_PATH} from './constants/other';
import TransformStreamToParse from './helpers/transformStreamToParse';
import csvGenerator from "./helpers/csvGenerator";

const options = yargs
    .usage("Usage: -sourceFile <sourceFile> /n -resultFile <resultFile> /n -separator <separator>")
    .options(OPTIONS)
    .argv;

// csvGenerator(options.sourceFile, TEMP_CSV_PATH).on('close', () => {
//     let readStream = fs.createReadStream(TEMP_CSV_PATH);
//     let writeStream = fs.createWriteStream(options.resultFile);
//     let myStream = new TransformStreamToParse();
//
//     readStream
//         .pipe(myStream)
//         .pipe(writeStream);
// });
const oauth2Client = new google.auth.OAuth2(
    "776414939785-m7guv2ohb24p6p8c6nb5be2o3186pkkn.apps.googleusercontent.com",
    "X9qUHmoyT8JkNOMrYUBnhwJP",
    'http://localhost:3000/callback'
);
const scopes = [
    'https://www.googleapis.com/auth/drive',
];

const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
});

const server = http.createServer( (req, res) => {
    if (req.url === '/') {
        res.writeHead(302, {
            'Location': url
        });
        res.end();
    }
    if (req.url === '/good') {
        const drive = google.drive({
            version: 'v3',
            auth: oauth2Client
        });

        async function main() {
            const res = await drive.files.create({
                requestBody: {
                    name: 'test.csv',
                    mimeType: 'text/csv'
                },
                media: {
                    mimeType: 'text/csv',
                    body: fs.createReadStream('src/files/test.csv')
                }
            });
            console.log(res.data);
        }

        main().catch(console.error);
    }
    else {
        const params = (req) => {
            let q=req.url.split('?'),result={};
            if(q.length>=2){
                q[1].split('&').forEach((item)=>{
                    try {
                        result[item.split('=')[0]]=item.split('=')[1];
                    } catch (e) {
                        result[item.split('=')[0]]='';
                    }
                })
            }
            return result;
        };

        req.params = params(req);
        const code = decodeURIComponent(req.params.code);

        const getToken = async () => {
            const { tokens } = await oauth2Client.getToken(code);
            return tokens;
        };

        const tokens = getToken();

        oauth2Client.setCredentials(tokens);

        oauth2Client.on('tokens', (tokens) => {
            if (tokens.refresh_token) {
                console.log("it's ok, refresh_token-------", tokens.refresh_token);
                oauth2Client.setCredentials({
                    refresh_token: tokens.refresh_token
                });
            }
            console.log("it's ok, access_token---------", tokens.access_token);
            res.writeHead(302, {
                'Location': "/good"
            });
            res.end();
        });
    }

});

server.listen(3000);

console.log('Node.js web server at port 3000 is running..');