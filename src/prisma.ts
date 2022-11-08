import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

export const prisma = new PrismaClient();

async function main() {
  const user = await prisma.users.findFirst({
    where: {
      username: process.env.USER as string
    }
  });

  if (!user) {
    const user = await prisma.users.create({
      data: {
        username: process.env.USER as string,
        password: await hash(process.env.PASSWORD as string, 10),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    console.log(user);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
