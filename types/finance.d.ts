import { TransactionType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

type Finance = {
  id: string;
  name: string;
  value: Decimal;
  type: TransactionType;
  date: Date;
  categoryId: string;
  goalId?: string | null;
  userId: string;
};
type FinanceInput = Omit<Finance, "id">;
