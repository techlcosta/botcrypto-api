import { ModeOfOperation, utils } from 'aes-js';

const aesKeyBytes = utils.utf8.toBytes(process.env.AES_KEY as string);

if (aesKeyBytes.length !== 32) throw new Error('Invalid key for AES. Must be 256-bit / 32 bytes');

export function encrypt(key: string): string {
  const bytesInfo = utils.utf8.toBytes(key);

  const aesCTR = new ModeOfOperation.ctr(aesKeyBytes);

  const encryptedBytes = aesCTR.encrypt(bytesInfo);

  const encryptedHex = utils.hex.fromBytes(encryptedBytes);

  return encryptedHex;
}

export function decrypt(encryptedHex: string): string {
  const encryptedBytes = utils.hex.toBytes(encryptedHex);

  const aesCTR = new ModeOfOperation.ctr(aesKeyBytes);

  const decryptedBytes = aesCTR.decrypt(encryptedBytes);

  const key = utils.utf8.fromBytes(decryptedBytes);

  return key;
}
