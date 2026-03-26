// Lightweight base64 encoder that works in React Native without extra deps

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function utf8Encode(str: string): string {
  let out = '';
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if (c < 128) {
      out += String.fromCharCode(c);
    } else if (c < 2048) {
      out += String.fromCharCode((c >> 6) | 192);
      out += String.fromCharCode((c & 63) | 128);
    } else {
      out += String.fromCharCode((c >> 12) | 224);
      out += String.fromCharCode(((c >> 6) & 63) | 128);
      out += String.fromCharCode((c & 63) | 128);
    }
  }
  return out;
}

export function encodeBase64(input: string): string {
  let str = utf8Encode(input);
  let output = '';
  let i = 0;

  while (i < str.length) {
    const c1 = str.charCodeAt(i++);
    const c2 = str.charCodeAt(i++);
    const c3 = str.charCodeAt(i++);

    const e1 = c1 >> 2;
    const e2 = ((c1 & 3) << 4) | (isNaN(c2) ? 0 : (c2 >> 4));
    const e3 = isNaN(c2) ? 64 : (((c2 & 15) << 2) | (isNaN(c3) ? 0 : (c3 >> 6)));
    const e4 = isNaN(c3) ? 64 : (c3 & 63);

    output +=
      CHARS.charAt(e1) +
      CHARS.charAt(e2) +
      CHARS.charAt(e3) +
      CHARS.charAt(e4);
  }

  return output;
}
