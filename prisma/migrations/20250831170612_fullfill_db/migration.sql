/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_userId_fkey`;

-- DropIndex
DROP INDEX `Order_userId_fkey` ON `Order`;

-- DropTable
DROP TABLE `User`;
