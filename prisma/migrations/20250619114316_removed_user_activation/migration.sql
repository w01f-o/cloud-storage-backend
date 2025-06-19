/*
  Warnings:

  - You are about to drop the column `activation_code` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `is_confirmed` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "activation_code",
DROP COLUMN "is_confirmed";
