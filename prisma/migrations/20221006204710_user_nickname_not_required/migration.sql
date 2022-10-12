/*
  Warnings:

  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(30)`.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "nickName" DROP NOT NULL,
ALTER COLUMN "nickName" SET DATA TYPE VARCHAR(30);
