import { prisma } from "@/lib/db";

export async function seedCategories(userId: string) {
  await prisma.category.createMany({
    data: [
      {
        name: "Salário",
        transactionType: "INCOME",
        color: "GREEN",
        userId: userId,
      },
      {
        name: "Investimentos",
        transactionType: "INCOME",
        color: "ORANGE",
        userId: userId,
      },
      {
        name: "Bônus",
        transactionType: "INCOME",
        color: "AQUA",
        userId: userId,
      },
      {
        name: "Casa",
        transactionType: "EXPENSE",
        color: "YELLOW",
        userId: userId,
      },
      {
        name: "Lazer",
        transactionType: "EXPENSE",
        color: "PINK",
        userId: userId,
      },
      {
        name: "Alimentação",
        transactionType: "EXPENSE",
        color: "RED",
        userId: userId,
      },
      {
        name: "Transporte",
        transactionType: "EXPENSE",
        color: "BLACK",
        userId: userId,
      },
      {
        name: "Plano de Assinatura",
        transactionType: "EXPENSE",
        color: "BLUE",
        userId: userId,
      },
    ],
  });
}
