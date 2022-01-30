'use strict';

const fs = require('fs');

/**
 * Get template from path, write data to it, and return.
 * @param { string } path File path to template
 * @param { object } templateData indentifiers used in template with corresponding data.
 * @param { string } startingTag Defaults to {{ as in {{data}}
 * @param { string } endingTag Defaults to }} as in {{data}}
 * @return { string } written data
 */
exports.use = function(path, templateData, startingTag = '{{', endingTag = '}}') {
    let htmlCode = String(fs.readFileSync(path));
    for (const key in templateData) {
        const regex = new RegExp(startingTag + '\\s*' + key + '\\s*' + endingTag, 'g');
        htmlCode =  htmlCode.replace(regex, templateData[key]);
    }
    return htmlCode;
}
