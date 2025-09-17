/*
  Warnings:

  - You are about to drop the column `supplier` on the `InventoryItem` table. All the data in the column will be lost.
  - You are about to drop the column `supplier` on the `PurchaseOrder` table. All the data in the column will be lost.
  - You are about to drop the column `item` on the `PurchaseOrderItem` table. All the data in the column will be lost.
  - Added the required column `supplierId` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inventoryItemId` to the `PurchaseOrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `GoodsReceipt` MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `InventoryItem` DROP COLUMN `supplier`;

-- AlterTable
ALTER TABLE `PurchaseOrder` DROP COLUMN `supplier`,
    ADD COLUMN `supplierId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `PurchaseOrderItem` DROP COLUMN `item`,
    ADD COLUMN `inventoryItemId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Supplier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `contactInfo` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Supplier_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PurchaseOrder` ADD CONSTRAINT `PurchaseOrder_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrderItem` ADD CONSTRAINT `PurchaseOrderItem_inventoryItemId_fkey` FOREIGN KEY (`inventoryItemId`) REFERENCES `InventoryItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
