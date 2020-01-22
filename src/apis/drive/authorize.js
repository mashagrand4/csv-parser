import fs from 'fs';
import {google} from 'googleapis';
import http from 'http';
import opn from 'open';
import getUrlParams from "../../helpers/getUrlParams";

const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';

const authorize = (credentials, callback) => {
    const {client_secret, client_id, redirect_uri} = credentials;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);

    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback);

        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
};

const getAccessToken = (oAuth2Client, callback) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    const server = http
        .createServer(async (req, res) => {
            if (req.url.indexOf('/callback') > -1) {
                const code = decodeURIComponent(getUrlParams(url).code);

                res.end('Authentication successful! Please return to the console.');
                server.close();

                oAuth2Client.getToken(code, (err, token) => {
                    if (err) return console.error('Error retrieving access token', err);

                    oAuth2Client.setCredentials(token);
                    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                        if (err) return console.error(err);
                    });
                    callback(oAuth2Client);
                });
            }
        })
        .listen(3000, () => {
            opn(authUrl, {wait: false}).then(cp => cp.unref());
        });
};

export default authorize;