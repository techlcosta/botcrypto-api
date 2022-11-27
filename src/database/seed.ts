import { hash } from 'bcrypt'
import { AesCrypto } from '../helpers/adapters/aesCrypto'
import { prisma } from '../prisma'

async function main (): Promise<void> {
  const user = await prisma.user.findFirst({
    where: {
      username: process.env.USER as string
    }
  })

  if (!user) {
    const { encrypt } = new AesCrypto()
    const newUser = await prisma.user.create({
      data: {
        username: process.env.USER as string,
        password: await hash(process.env.PASSWORD as string, 10),
        apiURL: process.env.API_URL as string,
        streamURL: process.env.STREAM_URL as string,
        accessKey: process.env.ACCESS_KEY as string,
        secretKey: encrypt(process.env.SECRET_KEY as string)
      }
    })
    console.log(newUser)
  } else {
    console.log(user)
  }

  const symbols = await prisma.symbol.findFirst()

  if (!symbols) {
    const newSymbol = await prisma.symbol.create({
      data: {
        symbol: 'BTCBUSD',
        base: 'BTC',
        quote: 'BUSD',
        basePrecision: 8,
        quotePrecision: 8,
        minNotional: '0.1',
        minLotSize: '0.1',
        isFavorite: true
      }
    })

    console.log(newSymbol)
  } else {
    console.log(symbols)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
