# EncryptHTMLDoc
Encrypt an HTML document using password.

## Usage
```bash
$ ./encrypthtml.js [filePath] [passwd] > output.html
```

## Password
- No salting, make sure your password is strong.
- Uses `SHA256` to hash passwords.

## Encryption
- Simple XOR encryption.
- Uses `SHA512` hash of password as the key to encrypt HTML file.
- The output HTML file contains JavaScript code that decrypts the embedded data.

## Example
Visit [/examples/digestive-system-passwd.html]() to see generated code.

Password to this file is `123`. Open in a browser.
