/*
  Warnings:

  - You are about to drop the `Ingredient` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Ingredient` DROP FOREIGN KEY `Ingredient_productId_fkey`;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `recipe` JSON NULL;

-- DropTable
DROP TABLE `Ingredient`;
