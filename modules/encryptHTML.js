'use strict';

const fs = require('fs');
const crypto = require('crypto');

const { helpTxt } = require('./helpTxt');
const Template = require('./template');

/**
 * @param { string } The string to hash
 * @return { string } Hex string
 */
const sha256sum = function(string) {
    const shasum = crypto.createHash('sha256');
    shasum.update(string);
    return shasum.digest('hex');
}

/**
 * @param { string } The string to hash
 * @return { string } Hex string
 */
const sha512sum = function(string) {   
    const shasum = crypto.createHash('sha512');
    shasum.update(string);
    return shasum.digest('hex');
}

/**
 * @param { string } input The string to encrypt
 * @param { string } key Encryption key
 * @return { string } hex cipher
 */
const xorEncrypt = function(input, key) {
    let cipher = '';
    while (key.length < input.length) {
        key += key;
    }
    for (let i = 0; i < input.length; i++) {
        const value1 = input[i].charCodeAt(0);
        const value2 = key[i].charCodeAt(0);
        const xorValue = value1 ^ value2;
        let xorValueAsHexString = xorValue.toString(36);
        if (xorValueAsHexString.length < 2) {
            xorValueAsHexString = "0" + xorValueAsHexString;
        }
        cipher += xorValueAsHexString;
    }
    return cipher;
}
/**
 * @param { string } input The string to decrypt
 * @param { string } key Encryption key
 * @return { string } plain text
 */
const xorDecrypt = function(input, key) {
    let text = '';
    while (key.length < input.length / 2) {
        key += key;
    }
    for (let i = 0; i < input.length; i += 2) {
        const hexValueString = input.substring(i, i + 2);
        const value1 = parseInt(hexValueString, 36);
        const value2 = key.charCodeAt(i / 2);
        const xorValue = value1 ^ value2;
        text += String.fromCharCode(xorValue);
    }
    return text;
}

exports.encrypt = function() {

    const argv = process.argv;
    if (!argv[3]) {
        console.log('encryptHtml: no arguments\n' + helpTxt);
        process.exit(2);
    }

    const inputData = String(fs.readFileSync(argv[3]));
    const passwd = argv[4];
    if (!passwd) {
        console.log('encryptHtml: no password\n' + helpTxt);
        process.exit(3);
    }

    // These sha hashes are of the password
    const sha256Passwd = sha256sum(passwd);
    const sha512key = sha512sum(passwd);

    console.error('Input size: ' + inputData.length + ' B');
    console.error('Password:\n  text: ' + passwd + '\n  hash: ' + sha256Passwd);

    const encryptedData = xorEncrypt(inputData, sha512key);

    // break the hex string into chunks each 64 bytes in length followed by a \n
    let outputBuffer = '';
    for (let i = 0; i < encryptedData.length; i++) {
        outputBuffer += encryptedData[i];
        if ((i + 1) % 64 === 0) {
            outputBuffer += '\n';
        }
    }
    console.log(Template.use('./templates/template.html', {
        sha256Passwd,
        data: outputBuffer,
    }));

}
