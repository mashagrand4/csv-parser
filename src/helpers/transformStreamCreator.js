const stream = require('stream');
const parser = require('./csvToJsonParser');

function createMyStream(){
    return new stream.Transform({
        transform: (chunk, encoding, callback) => {
            parser(chunk.toString());
            callback(null, chunk);
        }
    });
}

module.exports = createMyStream;