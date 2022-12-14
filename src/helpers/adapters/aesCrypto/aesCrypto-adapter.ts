import { ModeOfOperation, utils } from 'aes-js'

type _encrypt = (key: string) => string
type _decrypt = (key: string) => string

export interface AesCryptoAdapterInterface {
  encrypt: _encrypt
  decrypt: _decrypt
}

export class AesCrypto implements AesCryptoAdapterInterface {
  encrypt (key: string): string {
    const aesKeyBytes = utils.utf8.toBytes(process.env.AES_KEY as string)

    const bytesInfo = utils.utf8.toBytes(key)

    const aesCTR = new ModeOfOperation.ctr(aesKeyBytes)

    const encryptedBytes = aesCTR.encrypt(bytesInfo)

    const encryptedHex = utils.hex.fromBytes(encryptedBytes)

    return encryptedHex
  }

  decrypt (encryptedHex: string): string {
    const aesKeyBytes = utils.utf8.toBytes(process.env.AES_KEY as string)

    const encryptedBytes = utils.hex.toBytes(encryptedHex)

    const aesCTR = new ModeOfOperation.ctr(aesKeyBytes)

    const decryptedBytes = aesCTR.decrypt(encryptedBytes)

    const key = utils.utf8.fromBytes(decryptedBytes)

    return key
  }
}
