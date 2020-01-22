const {google} = require('googleapis');
const fs = require('fs');

const oauth2Client = new google.auth.OAuth2(
    "776414939785-m7guv2ohb24p6p8c6nb5be2o3186pkkn.apps.googleusercontent.com",
    "X9qUHmoyT8JkNOMrYUBnhwJP",
    'http://localhost:3000/callback'
);

const getToken = async () => {
    const {tokens} = await oauth2Client.getToken(code);
    return tokens;
};

const tokens = getToken();

console.log(tokens);

//oauth2Client.setCredentials(tokens);

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

export default main;

// const scopes = [
//     "https://www.googleapis.com/auth/drive",
// ];
//
// const url = oauth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: scopes
// });

