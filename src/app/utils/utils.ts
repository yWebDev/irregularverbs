import * as CryptoJS from 'crypto-js';

export class Utils {
  static decrypt(ciphertext: string, secretKey: string): string {
    const data = CryptoJS.AES.decrypt(ciphertext, secretKey).toString(
      CryptoJS.enc.Utf8,
    );
    return data;
  }
}
