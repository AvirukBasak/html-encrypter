'use strict';

const fs = require('fs');
const { URL } = require('url');

const { helpTxt } = require('./helpTxt');

/**
 * @param { string } string The path
 * @return { URL | undefined } If valid, returns new URL, undefined otherwise
 */
const isUrlValid = function(string) {
    try {
        return new URL(string);
    } catch (error) {
        return null;
    }
}

exports.get = function() {

    const argv = process.argv;
    if (!argv[3]) {
        console.log('encryptHtml: no path\n' + helpTxt);
        process.exit(2);
    }

    let filePath = isUrlValid(argv[3]) || argv[3];
    const data = fs.readFileSync(filePath).toString('base64');

    let outputBuffer = '';
    for (let i = 0; i < data.length; i++) {
        outputBuffer += data[i];
        if ((i + 1) % 64 === 0) {
            outputBuffer += '\n';
        }
    }
    return outputBuffer;
}
