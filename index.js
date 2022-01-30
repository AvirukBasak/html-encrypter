#!/usr/bin/env node

'use strict';

const EncryptHTML = require('./modules/encryptHTML');
const Base64Img = require('./modules/base64Img');

const { helpTxt } = require('./modules/helpTxt');

(function main(args) {
    !args[2] && ( args[2] = '' );
    switch (args[2].toLowerCase()) {
        case 'h':
        case 'help': {
            console.log(helpTxt);
            break;
        }
        case '64img':
        case 'base64img': {
            console.log(Base64Img.get(args));
            break;
        }
        case 'ehtml':
        case 'encryptHtml': {
            EncryptHTML.encrypt(args);
            break;
        }
        default: {
            console.log('error: invalid argument\n' + helpTxt);
            process.exit(1);
        }
    }
})(process.argv);
