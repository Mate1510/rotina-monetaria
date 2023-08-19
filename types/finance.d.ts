import { TransactionType } from "@prisma/client";

type Finance = {
  id: string;
  name: string;
  value: Number;
  type: TransactionType;
  date: Date;
  categoryId: string;
  goalId?: string | null;
  userId: string;
};
type FinanceInput = Omit<Finance, "id">;
