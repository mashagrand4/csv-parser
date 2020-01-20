import stream from 'stream';

export class TransformStreamToParse extends stream.Transform {
    constructor() {
        super();
        this.headers = [];
        this.lastLine = '';
        this.firstChunk = true;
    }

    _transform(chunk, encoding, callback) {
        try {
            const data = this.parser(chunk);
            callback(null, JSON.stringify(data, null, 4));
        }
        catch (err) {
            callback(err);
        }
    }

    _flush(callback) {
        if (this.lastLine) {
            try {
                const data = this.parser(this.lastLine);
                this.lastLine = '';
                callback(null, JSON.stringify(data, null, 4));
            }
            catch (err) {
                callback(err);
            }
        }
    }

    parser(chunk) {
        let lines = chunk.toString().split("\r");

        if (this.firstChunk) {
            this.headers = lines.shift().split(",");
            this.firstChunk = false;
            this.lastLine = lines.pop();
        } else {
            lines.unshift(this.lastLine);
            this.lastLine = lines.pop();
        }

        return lines.map((line) => {
            let lineItems = line.split(",");
            return this.headers.reduce((o, k, i) => ({...o, [k]: lineItems[i]}), {})
        });
    }
}

export default TransformStreamToParse;