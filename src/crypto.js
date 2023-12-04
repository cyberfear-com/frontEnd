

// node-forge

const BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

export function encode64(input, maxline) {
    // TODO: deprecate: "Deprecated. Use util.binary.base64.encode instead."
    var line = '';
    var output = '';
    var chr1, chr2, chr3;
    var i = 0;
    while(i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        // encode 4 character group
        line += BASE64.charAt(chr1 >> 2);
        line += BASE64.charAt(((chr1 & 3) << 4) | (chr2 >> 4));
        if(isNaN(chr2)) {
            line += '==';
        } else {
            line += BASE64.charAt(((chr2 & 15) << 2) | (chr3 >> 6));
            line += isNaN(chr3) ? '=' : BASE64.charAt(chr3 & 63);
        }

        if(maxline && line.length > maxline) {
            output += line.substr(0, maxline) + '\r\n';
            line = line.substr(maxline);
        }
    }
    output += line;
    return output;
}


// Core

export async function pbkdf2(password, salt, iterations, keySize) {
    if (typeof password === 'string') {
        password = encode(password)
    }
    if (typeof salt === 'string') {
        salt = encode(salt)
    }
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        password,
        "PBKDF2",
        false,
        ["deriveBits", "deriveKey"]
    );

    const keyBits = await window.crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt,
            iterations,
            hash: 'SHA-1',
        },
        keyMaterial,
        keySize * 8,
    );
    return keyBits
}

export function base64ToArrayBuffer(binary_string) {
    //var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

export function ab2str(bytes) {
    return String.fromCharCode.apply(null, new Uint8Array(bytes))
}

export function ab2hex(bytes) {
    return Array.from(new Uint8Array(bytes), function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}

const encoder = new TextEncoder()
const decoder = new TextDecoder()

export function encode(str) {
    return encoder.encode(str)
}

export function encode8(s) {
    return Uint8Array.from(s, x => {
        return x.charCodeAt(0)
    })
}

export function decode(str) {
    return decoder.decode(str)
}

export function to64str(string) {
    return encode64(string)
    // return btoa(unescape(encodeURIComponent(string)))
}

// Mailum

const USER_SALT = ''

export async function generatePinKey(pin) {
    return pbkdf2(pin, '', 256, 32)
}

export async function encryptPin(pin) {
    const pinKey = await generatePinKey(pin)
    return await pbkdf2(pinKey, 'ScRypTmAilSaltForPiN', new Uint8Array(pinKey)[0], 64)
}

export async function decryptAes64bin(base64, pin){

    const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        encode8(pin),
        { name: 'AES-CBC', length: 256 },
        true,
        ['encrypt', 'decrypt']
    )

    var textData = base64.split(';')
    var iv = atob(textData[0])
    var encrypted = atob(textData[1])
    const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-CBC', iv: encode8(iv) },
        keyMaterial,
        encode8(encrypted)
    )
    return decode(decrypted)
}

export async function decryptAes64(base64, pin) {
    const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        encode(pin),
        'PBKDF2',
        false,
        ['deriveKey', 'deriveBits'],
    )
    const pinKey = await window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            hash: 'SHA-1',
            salt: encode(''),
            iterations: 256,
        },
        keyMaterial,
        { name: 'AES-CBC', length: 256 },
        true,
        ['encrypt', 'decrypt']
    )

    var textData = base64.split(';')
    var iv = atob(textData[0])
    var encrypted = atob(textData[1])
    const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-CBC', iv: encode8(iv) },
        pinKey,
        encode8(encrypted)
    )
    return decode(decrypted)
}

export async function createEncryptionKey256() {
    const keyBuf = window.crypto.getRandomValues(new Uint8Array(32))
    // const keyBuf = new Uint8Array(32)

    const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        keyBuf,
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
    )
    return await window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: encode8(USER_SALT),
            iterations: 4096,
            hash: 'SHA-1',
        },
        keyMaterial,
        { name: 'AES-CBC', length: 256 },
        true,
        ['encrypt', 'decrypt']
    )
}

export async function makeModKey() {
    let key = await createEncryptionKey256()
    let keyBytes = await crypto.subtle.exportKey('raw', key)
    return ab2hex(
        await pbkdf2(
            keyBytes,
            USER_SALT,
            16,
            16
        )
    )
}

export async function encryptAes64(key, str) {
    let iv = new Uint8Array(16)
    let encrypted = await window.crypto.subtle.encrypt(
        {
            name: 'AES-CBC',
            iv
        },
        key,
        encode(str)
    )
    return `${encode64(ab2str(iv))};${encode64(ab2str(encrypted))}`
}
