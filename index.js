#!/usr/bin/env node

'use strict';

const EncryptHTML = require('./modules/encryptHTML');
const Base64Img = require('./modules/base64Img');

(() => {
    switch (process.argv[2].toLowerCase()) {
        case 'help': {
            console.log('USAGE:\n'
                + '    index base64img   [url] > file                --  Download an image and convert to b64\n'
                + '    index encryptHtml [filePath] [passwd] > file  --  Encrypt an HTML document\n');
            break;
        }
        case '64img':
        case 'base64img': {
            Base64Img.get();
            break;
        }
        case 'ehtml':
        case 'encryptHtml': {
            EncryptHtml.encrypt();
            break;
        }
        default: {
            console.log('error: invalid argument\n'
                + 'USAGE:\n'
                + '    index base64img   [url] > file                --  Download an image and convert to b64\n'
                + '    index encryptHtml [filePath] [passwd] > file  --  Encrypt an HTML document\n');
            process.exit(1);
        }
})();
