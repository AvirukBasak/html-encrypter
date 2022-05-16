# HTML Encrypter
Encrypt an HTML document using password.

## Usage

#### Code
```bash
$ npm start ehtml [filePath] [passwd] > output.html
```

#### Help text
```
USAGE:
    index 64img | base64img [url] > file
        Download an image and convert to b64
    index ehtml | encryptHtml [filePath] [passwd] > file
        Encrypt an HTML document
```

## Password
- No salting, make sure your password is strong.
- Uses `SHA256` to hash passwords.

## Encryption
- Simple XOR encryption.
- Uses `SHA512` hash of password as the key to encrypt HTML file.
- The output HTML file contains JavaScript code that decrypts the embedded data.

## Example
Visit [digestive-system-passwd.html](https://github.com/OogleGlu/EncryptHTMLDoc/blob/main/examples/digestive-system-passwd.html) to see generated code.

Password to this file is `123`. Clone and open it in a browser.
