-- DropForeignKey
ALTER TABLE `GoodsReceipt` DROP FOREIGN KEY `GoodsReceipt_purchaseOrderId_fkey`;

-- DropForeignKey
ALTER TABLE `InventoryAdjustment` DROP FOREIGN KEY `InventoryAdjustment_inventoryItemId_fkey`;

-- DropForeignKey
ALTER TABLE `ProductRecipe` DROP FOREIGN KEY `ProductRecipe_inventoryItemId_fkey`;

-- DropForeignKey
ALTER TABLE `ProductionIngredientDeduction` DROP FOREIGN KEY `ProductionIngredientDeduction_inventoryItemId_fkey`;

-- DropForeignKey
ALTER TABLE `ProductionRun` DROP FOREIGN KEY `ProductionRun_productId_fkey`;

-- DropForeignKey
ALTER TABLE `PurchaseOrder` DROP FOREIGN KEY `PurchaseOrder_supplierId_fkey`;

-- DropForeignKey
ALTER TABLE `PurchaseOrderItem` DROP FOREIGN KEY `PurchaseOrderItem_inventoryItemId_fkey`;

-- DropForeignKey
ALTER TABLE `PurchaseOrderItem` DROP FOREIGN KEY `PurchaseOrderItem_purchaseOrderId_fkey`;

-- DropForeignKey
ALTER TABLE `Sale` DROP FOREIGN KEY `Sale_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `SaleItem` DROP FOREIGN KEY `SaleItem_productId_fkey`;

-- DropForeignKey
ALTER TABLE `SaleItem` DROP FOREIGN KEY `SaleItem_saleId_fkey`;

-- DropIndex
DROP INDEX `GoodsReceipt_purchaseOrderId_fkey` ON `GoodsReceipt`;

-- DropIndex
DROP INDEX `InventoryAdjustment_inventoryItemId_fkey` ON `InventoryAdjustment`;

-- DropIndex
DROP INDEX `ProductRecipe_inventoryItemId_fkey` ON `ProductRecipe`;

-- DropIndex
DROP INDEX `ProductionIngredientDeduction_inventoryItemId_fkey` ON `ProductionIngredientDeduction`;

-- DropIndex
DROP INDEX `ProductionRun_productId_fkey` ON `ProductionRun`;

-- DropIndex
DROP INDEX `PurchaseOrder_supplierId_fkey` ON `PurchaseOrder`;

-- DropIndex
DROP INDEX `PurchaseOrderItem_inventoryItemId_fkey` ON `PurchaseOrderItem`;

-- DropIndex
DROP INDEX `PurchaseOrderItem_purchaseOrderId_fkey` ON `PurchaseOrderItem`;

-- DropIndex
DROP INDEX `Sale_customerId_fkey` ON `Sale`;

-- DropIndex
DROP INDEX `SaleItem_productId_fkey` ON `SaleItem`;

-- DropIndex
DROP INDEX `SaleItem_saleId_fkey` ON `SaleItem`;

-- AlterTable
ALTER TABLE `Sale` MODIFY `customerId` INTEGER NULL;

-- CreateTable
CREATE TABLE `_ExpenseApprovedBy` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ExpenseApprovedBy_AB_unique`(`A`, `B`),
    INDEX `_ExpenseApprovedBy_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleItem` ADD CONSTRAINT `SaleItem_saleId_fkey` FOREIGN KEY (`saleId`) REFERENCES `Sale`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleItem` ADD CONSTRAINT `SaleItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrder` ADD CONSTRAINT `PurchaseOrder_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrderItem` ADD CONSTRAINT `PurchaseOrderItem_purchaseOrderId_fkey` FOREIGN KEY (`purchaseOrderId`) REFERENCES `PurchaseOrder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrderItem` ADD CONSTRAINT `PurchaseOrderItem_inventoryItemId_fkey` FOREIGN KEY (`inventoryItemId`) REFERENCES `InventoryItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsReceipt` ADD CONSTRAINT `GoodsReceipt_purchaseOrderId_fkey` FOREIGN KEY (`purchaseOrderId`) REFERENCES `PurchaseOrder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryAdjustment` ADD CONSTRAINT `InventoryAdjustment_inventoryItemId_fkey` FOREIGN KEY (`inventoryItemId`) REFERENCES `InventoryItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductionRun` ADD CONSTRAINT `ProductionRun_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductRecipe` ADD CONSTRAINT `ProductRecipe_inventoryItemId_fkey` FOREIGN KEY (`inventoryItemId`) REFERENCES `InventoryItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductionIngredientDeduction` ADD CONSTRAINT `ProductionIngredientDeduction_inventoryItemId_fkey` FOREIGN KEY (`inventoryItemId`) REFERENCES `InventoryItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ExpenseApprovedBy` ADD CONSTRAINT `_ExpenseApprovedBy_A_fkey` FOREIGN KEY (`A`) REFERENCES `Expense`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ExpenseApprovedBy` ADD CONSTRAINT `_ExpenseApprovedBy_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
