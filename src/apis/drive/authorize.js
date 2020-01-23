import fs from 'fs';
import {google} from 'googleapis';
import http from 'http';
import opn from 'open';
import getUrlParams from "../../helpers/getUrlParams";

const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';

const authorize = credentials => {
    return new Promise(async (resolve, reject) => {
        const {client_secret, client_id, redirect_uri} = credentials;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);

        await fs.readFile(TOKEN_PATH, async (err, currentToken) => {
            let token;
            if (err) {
                token = await getAccessToken(oAuth2Client);
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) return console.error(err);

                    oAuth2Client.setCredentials(token);
                    resolve(oAuth2Client);
                });
            } else {
                token = JSON.parse(currentToken);
                oAuth2Client.setCredentials(token);
                resolve(oAuth2Client);
            }
        });
    });
};

const getAccessToken = oAuth2Client => {
    return new Promise((resolve, reject) => {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });

        const server = http
            .createServer( async (req, res) => {
                if (req.url.indexOf('/callback') > -1) {
                    const code = decodeURIComponent(getUrlParams(req.url).code);

                    res.end('Authentication successful! Please return to the console.');
                    server.close();

                    const {tokens: token} = await oAuth2Client.getToken(code);

                    resolve(token);
                }
            })
            .listen(3000, () => {
                opn(authUrl, {wait: false}).then(childProcess => childProcess.unref());
            });
    });
};

export default authorize;