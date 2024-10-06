/*
  Warnings:

  - You are about to drop the column `remind_at` on the `reminders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "reminders" DROP COLUMN "remind_at",
ADD COLUMN     "reminds_at" TIMESTAMP(3)[];
