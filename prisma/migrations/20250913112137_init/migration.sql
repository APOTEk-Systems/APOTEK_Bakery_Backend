/*
  Warnings:

  - You are about to drop the column `unit` on the `GoodsReceipt` table. All the data in the column will be lost.
  - You are about to drop the column `recipe` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `ingredient` on the `ProductionIngredientDeduction` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `PurchaseOrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `unitCost` on the `PurchaseOrderItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productionRunId,inventoryItemId]` on the table `ProductionIngredientDeduction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `unit` to the `InventoryItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inventoryItemId` to the `ProductionIngredientDeduction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ProductionIngredientDeduction` DROP FOREIGN KEY `ProductionIngredientDeduction_productionRunId_fkey`;

-- DropIndex
DROP INDEX `ProductionIngredientDeduction_productionRunId_fkey` ON `ProductionIngredientDeduction`;

-- AlterTable
ALTER TABLE `GoodsReceipt` DROP COLUMN `unit`;

-- AlterTable
ALTER TABLE `InventoryItem` ADD COLUMN `unit` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `recipe`;

-- AlterTable
ALTER TABLE `ProductionIngredientDeduction` DROP COLUMN `ingredient`,
    ADD COLUMN `inventoryItemId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `ProductionRun` ADD COLUMN `finalizedAt` DATETIME(3) NULL,
    ADD COLUMN `status` ENUM('PENDING', 'FINALIZED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `PurchaseOrderItem` DROP COLUMN `unit`,
    DROP COLUMN `unitCost`;

-- CreateTable
CREATE TABLE `ProductRecipe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `inventoryItemId` INTEGER NOT NULL,
    `amountRequired` DOUBLE NOT NULL,

    UNIQUE INDEX `ProductRecipe_productId_inventoryItemId_key`(`productId`, `inventoryItemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `ProductionIngredientDeduction_productionRunId_inventoryItemI_key` ON `ProductionIngredientDeduction`(`productionRunId`, `inventoryItemId`);

-- AddForeignKey
ALTER TABLE `ProductRecipe` ADD CONSTRAINT `ProductRecipe_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductRecipe` ADD CONSTRAINT `ProductRecipe_inventoryItemId_fkey` FOREIGN KEY (`inventoryItemId`) REFERENCES `InventoryItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductionIngredientDeduction` ADD CONSTRAINT `ProductionIngredientDeduction_productionRunId_fkey` FOREIGN KEY (`productionRunId`) REFERENCES `ProductionRun`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductionIngredientDeduction` ADD CONSTRAINT `ProductionIngredientDeduction_inventoryItemId_fkey` FOREIGN KEY (`inventoryItemId`) REFERENCES `InventoryItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
