import stream from 'stream';

export class TransformStreamToParse extends stream.Transform {
    constructor() {
        super();
        this.headers = [];
        this.lastLine = '';
    }

    _transform(chunk, encoding, callback) {
        try {
            const data = this.parseToJson(chunk);
            callback(null, JSON.stringify(data, null, 4));
        }
        catch (err) {
            callback(err);
        }
    }

    _flush(callback) {
        if (this.lastLine) {
            try {
                let lastLine = this.lastLine;
                this.lastLine = '';
                const data = this.parseToJson(lastLine);
                callback(null, JSON.stringify(data, null, 4));
            }
            catch (err) {
                callback(err);
            }
        }
    }

    parseToJson(chunk) {
        let lines = chunk.toString();
        lines = this.lastLine.concat(lines).split("\r");

        if (!this.headers.length) {
            this.headers = lines.shift().split(",");
        }

        if(lines.length > 1) {
            this.lastLine = lines.pop();
        }

        return lines.map((line) => {
            let lineItems = line.split(",");

            return this.headers.reduce((result, headerKey, index) => {
                return ({
                    ...result,
                    [headerKey]: lineItems[index]
                });
            }, {});
        });
    }
}

export default TransformStreamToParse;