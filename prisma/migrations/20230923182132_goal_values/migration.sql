/*
  Warnings:

  - You are about to drop the column `value` on the `Goal` table. All the data in the column will be lost.
  - Added the required column `currentGoalValue` to the `Goal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finalGoalValue` to the `Goal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "value",
ADD COLUMN     "currentGoalValue" DECIMAL(9,2) NOT NULL,
ADD COLUMN     "finalGoalValue" DECIMAL(9,2) NOT NULL;
