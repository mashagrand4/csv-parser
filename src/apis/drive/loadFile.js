import {google} from "googleapis";
import fs from "fs";

const loadFile = async (auth, options) => {
    const drive = google.drive({
        version: 'v3',
        auth
    });

    const res = await drive.files.create({
        requestBody: {
            name: options.name,
            mimeType: options.mimeType
        },
        media: {
            mimeType: options.mimeType,
            body: fs.createReadStream(options.path)
        }
    });

    console.log(res.data);
};

export default loadFile;