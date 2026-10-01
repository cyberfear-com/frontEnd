// Web worker for the signup captcha puzzle: finds the number n in 0..max for which
// sha256(salt + n) equals target, and posts it back ("" when there is none).
var K = new Int32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);
var w = new Int32Array(64);
var hash = new Int32Array(8);

// SHA-256 of a short ASCII string (one block, under 56 characters) into hash
function sha256(text) {
    var i, t1, t2, s0, s1;
    var length = text.length;
    for (i = 0; i < 16; i++) w[i] = 0;
    for (i = 0; i < length; i++) w[i >> 2] |= text.charCodeAt(i) << (24 - (i & 3) * 8);
    w[length >> 2] |= 0x80 << (24 - (length & 3) * 8);
    w[15] = length * 8;
    for (i = 16; i < 64; i++) {
        s0 = w[i - 15];
        s1 = w[i - 2];
        w[i] = (w[i - 16] + w[i - 7]
            + (((s0 >>> 7) | (s0 << 25)) ^ ((s0 >>> 18) | (s0 << 14)) ^ (s0 >>> 3))
            + (((s1 >>> 17) | (s1 << 15)) ^ ((s1 >>> 19) | (s1 << 13)) ^ (s1 >>> 10))) | 0;
    }
    var a = 0x6a09e667, b = 0xbb67ae85 | 0, c = 0x3c6ef372, d = 0xa54ff53a | 0,
        e = 0x510e527f, f = 0x9b05688c | 0, g = 0x1f83d9ab, h = 0x5be0cd19;
    for (i = 0; i < 64; i++) {
        t1 = (h + (((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7)))
            + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0;
        t2 = ((((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10)))
            + ((a & b) ^ (a & c) ^ (b & c))) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0;
        d = c; c = b; b = a; a = (t1 + t2) | 0;
    }
    hash[0] = a + 0x6a09e667; hash[1] = b + 0xbb67ae85; hash[2] = c + 0x3c6ef372; hash[3] = d + 0xa54ff53a;
    hash[4] = e + 0x510e527f; hash[5] = f + 0x9b05688c; hash[6] = g + 0x1f83d9ab; hash[7] = h + 0x5be0cd19;
}

onmessage = function (event) {
    var puzzle = event.data;
    var target = new Int32Array(8);
    var i, n;
    for (i = 0; i < 8; i++) target[i] = parseInt(puzzle.target.substr(i * 8, 8), 16);
    for (n = 0; n <= puzzle.max; n++) {
        sha256(puzzle.salt + n);
        for (i = 0; i < 8 && hash[i] === target[i]; i++);
        if (i === 8) return postMessage(n);
    }
    postMessage("");
};
