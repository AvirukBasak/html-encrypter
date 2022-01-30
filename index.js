#!/usr/bin/env node

'use strict';

const EncryptHTML = require('./modules/encryptHTML');
const Base64Img = require('./modules/base64Img');

const { helpTxt } = require('./modules/helpTxt');

(() => {
    !process.argv[2] && ( process.argv[2] = '' );
    switch (process.argv[2].toLowerCase()) {
        case 'h':
        case 'help': {
            console.log(helpTxt);
            break;
        }
        case '64img':
        case 'base64img': {
            Base64Img.get();
            break;
        }
        case 'ehtml':
        case 'encryptHtml': {
            EncryptHTML.encrypt();
            break;
        }
        default: {
            console.log('error: invalid argument\n' + helpTxt);
            process.exit(1);
        }
    }
})();
