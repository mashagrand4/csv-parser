import {google} from "googleapis";
import fs from "fs";
import authorize from "./authorize";
import {CREDENTIALS} from '../../constants/credentials'

const uploadFile = async options => {
    const auth = await authorize(CREDENTIALS);

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

export default uploadFile;