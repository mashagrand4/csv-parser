import stream from 'stream';

export class TransformStreamCreator extends stream.Transform {
    constructor() {
        super();
        this.headers = [];
    }

    _transform(chunk, encoding, callback) {
        const data = this.parser(chunk);
        callback(null, JSON.stringify(data, null, 4));
    }

    parser(chunk) {
        let lines = chunk.toString().split("\r");

        if(!this.headers.length) {
            this.headers = lines.shift().split(",");
            console.log(lines);
        } else {
            return lines.map((line) => {
                let lineItems = line.split(",");
                return this.headers.reduce((o, k, i) => ({...o, [k]: lineItems[i]}), {})
            });
        }
    }
}

export default TransformStreamCreator;