import { prisma } from "@/lib/db";

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
          { name: "Salário", transactionType: "INCOME", color: "GREEN", userId: user.id },
          { name: "Investimentos", transactionType: "INCOME", color: "ORANGE", userId: user.id },
          { name: "Bônus", transactionType: "INCOME", color: "AQUA", userId: user.id },
          { name: "Casa", transactionType: "EXPENSE", color: "YELLOW", userId: user.id },
          { name: "Lazer", transactionType: "EXPENSE", color: "PINK", userId: user.id },
          { name: "Alimentação", transactionType: "EXPENSE", color: "RED", userId: user.id },
          { name: "Transporte", transactionType: "EXPENSE", color: "BLACK", userId: user.id },
          {
            name: "Plano de Assinatura",
            transactionType: "EXPENSE",
            userId: user.id,
          },
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
