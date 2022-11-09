import { hash } from 'bcrypt'
import { encrypt } from '../helpers/secure/appCrypto'
import { prisma } from '../prisma'

async function main (): Promise<void> {
  const user = await prisma.users.findFirst({
    where: {
      username: process.env.USER as string
    }
  })

  if (user == null) {
    const newUser = await prisma.users.create({
      data: {
        username: process.env.USER as string,
        password: await hash(process.env.PASSWORD as string, 10),
        apiURL: process.env.API_URL as string,
        accessKey: process.env.ACCESS_KEY as string,
        secretKey: encrypt(process.env.SECRET_KEY as string),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    console.log(newUser)
  } else {
    console.log(user)
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
