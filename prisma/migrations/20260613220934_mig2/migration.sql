/*
  Warnings:

  - You are about to drop the column `statues` on the `Recipient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Recipient" DROP COLUMN "statues",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';
