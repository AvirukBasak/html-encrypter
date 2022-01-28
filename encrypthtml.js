#!/usr/bin/env node

'use strict';

/**
 * @param { string } The string to hash
 * @return { string } Hex string
 */
const sha256sum = function(string) {
    const crypto = require('crypto');
    const shasum = crypto.createHash('sha256');
    shasum.update(string);
    return shasum.digest('hex');
}

/**
 * @param { string } The string to hash
 * @return { string } Hex string
 */
const sha512sum = function(string) {
    const crypto = require('crypto');
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

/**
 * generates output from templates
 * @param { string } data Hex string encrypted data
 * @param { string } sha256hash SHA256 hash of password
 */
const genOutputCode = (data, sha256Passwd) => (
`<!DOCTYPE html>
<html>
<head>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/google-closure-library@20220104.0.0/closure/goog/base.js"></script>
    <script type="text/javascript">
        goog.require('goog.crypt');
        goog.require('goog.crypt.Sha256');
        goog.require('goog.crypt.Sha512');
    </script>
    <script type="text/javascript">
        /**
         * @param { string } The string to hash
         * @return { string } Hex string
         */
        const sha256sum = function(string) {
            const sha256 = new goog.crypt.Sha256();
            sha256.update(string);
            const hash = sha256.digest();
            return goog.crypt.byteArrayToHex(hash);
        }
        /**
         * @param { string } The string to hash
         * @return { string } Hex string
         */
        const sha512sum = function(string) {
            const sha512 = new goog.crypt.Sha512();
            sha512.update(string);
            const hash = sha512.digest();
            return goog.crypt.byteArrayToHex(hash);
        }
    </script>
    <script type="text/javascript">
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
    </script>
    <script type="text/javascript">

        // required data
        const HtmlRoot = document.getElementsByTagName('html')[0];
        const sha256Passwd = '${sha256Passwd}';

        // hex encoded and encrypted data
        const encryptedData = (\x60
${data}
        \x60).replace(/\\s|\\n/g, '');

        // input password
        const inputPasswd = prompt('Enter password');

        (() => {
            const sha256InputPasswd = sha256sum(inputPasswd);
            if (sha256Passwd !== sha256InputPasswd) {
                alert('Password wrong. Authentication failed.');
                return;
            }
            const sha512key = sha512sum(inputPasswd);
            let decryptedData = xorDecrypt(encryptedData, sha512key);
            HtmlRoot.innerHTML = decryptedData;
        })();

    </script>
</head>
</html>`);

// main method
(() => {

    const argv = process.argv;
    if (!argv[2]) {
        console.error('encrypthtml: no args provided\n'
            + 'USAGE:\n'
            + '    encrypthtml.js [filePath] [passwd]');
        process.exit(1);
    }

    const inputData = String(require('fs').readFileSync(argv[2]));
    const passwd = argv[3];
    if (!passwd) {
        console.error('encrypthtml: no password provided\n'
            + 'USAGE:\n'
            + '    encrypthtml.js [filePath] [passwd]');
        process.exit(2);
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
    console.log(genOutputCode(outputBuffer, sha256Passwd));

})();
