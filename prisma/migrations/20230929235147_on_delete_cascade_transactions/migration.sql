-- DropForeignKey
ALTER TABLE "FinanceTransaction" DROP CONSTRAINT "FinanceTransaction_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "FinanceTransaction" DROP CONSTRAINT "FinanceTransaction_goalId_fkey";

-- AddForeignKey
ALTER TABLE "FinanceTransaction" ADD CONSTRAINT "FinanceTransaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinanceTransaction" ADD CONSTRAINT "FinanceTransaction_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
