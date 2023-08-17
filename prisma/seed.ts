import { prisma } from "../src/lib/db";


async function main() {
    const users = await prisma.user.findMany();

    for (const user of users) {
      const userCategories = await prisma.category.findMany({
        where: {
          userId: user.id,
        },
      });

      if (userCategories.length === 0) {
        // Create default categories for the user
        await prisma.category.createMany({
          data: [
            { name: 'Salário', transactionType: "INCOME", userId: user.id },
            { name: 'Investimentos', transactionType: "INCOME", userId: user.id },
            { name: 'Bônus', transactionType: "INCOME", userId: user.id },
            { name: 'Casa', transactionType: "EXPENSE", userId: user.id },
            { name: 'Lazer', transactionType: "EXPENSE", userId: user.id },
            { name: 'Alimentação', transactionType: "EXPENSE", userId: user.id },
            { name: 'Plano de Assinatura', transactionType: "EXPENSE", userId: user.id },
          ],
        });
      }
    }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

