import { hash } from 'bcrypt'
import { AesCrypto } from '../helpers/adapters/aesCrypto/aesCrypto-adapter'
import { MonitorTypes } from '../modules/monitors/interfaces/monitors-interface'
import { prisma } from '../prisma'

async function main (): Promise<void> {
  let user = await prisma.user.findFirst({
    where: {
      username: process.env.USER as string
    }
  })

  if (!user) {
    const { encrypt } = new AesCrypto()
    user = await prisma.user.create({
      data: {
        username: process.env.USER as string,
        password: await hash(process.env.PASSWORD as string, 10),
        apiURL: process.env.API_URL as string,
        streamURL: process.env.STREAM_URL as string,
        accessKey: process.env.ACCESS_KEY as string,
        secretKey: encrypt(process.env.SECRET_KEY as string)
      }
    })
    console.log(user)

    const newSymbol = await prisma.symbol.create({
      data: {
        symbol: 'BTCBUSD',
        base: 'BTC',
        quote: 'BUSD',
        basePrecision: 8,
        quotePrecision: 8,
        minNotional: '0.1',
        minLotSize: '0.1',
        isFavorite: true,
        userId: user.id
      }
    })

    console.log(newSymbol)
  } else {
    console.log(user)
  }

  const monitors = await prisma.monitor.findFirst({ where: { symbol: '*' } })

  if (!monitors) {
    await prisma.monitor.createMany({
      data: [
        {
          symbol: '*',
          userId: user.id,
          type: MonitorTypes.MINI_TICKER,
          isActive: true,
          isSystemMonitor: true,
          broadcastLabel: 'miniTickerStream'
        },
        {
          symbol: '*',
          userId: user.id,
          type: MonitorTypes.USER_DATA,
          isActive: true,
          isSystemMonitor: true,
          broadcastLabel: 'balanceStream,executionStream'
        },
        {
          symbol: 'BTCBUSD',
          userId: user.id,
          type: MonitorTypes.CANDLES,
          isActive: true,
          isSystemMonitor: false,
          indexes: 'RSI,MACD',
          interval: '1m'
        }

      ]
    })
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
