-- DropForeignKey
ALTER TABLE `Customer` DROP FOREIGN KEY `Customer_updatedById_fkey`;

-- DropForeignKey
ALTER TABLE `Expense` DROP FOREIGN KEY `Expense_updatedById_fkey`;

-- DropForeignKey
ALTER TABLE `InventoryItem` DROP FOREIGN KEY `InventoryItem_updatedById_fkey`;

-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_updatedById_fkey`;

-- DropForeignKey
ALTER TABLE `ProductionRun` DROP FOREIGN KEY `ProductionRun_updatedById_fkey`;

-- DropIndex
DROP INDEX `Customer_updatedById_fkey` ON `Customer`;

-- DropIndex
DROP INDEX `Expense_updatedById_fkey` ON `Expense`;

-- DropIndex
DROP INDEX `InventoryItem_updatedById_fkey` ON `InventoryItem`;

-- DropIndex
DROP INDEX `Product_updatedById_fkey` ON `Product`;

-- DropIndex
DROP INDEX `ProductionRun_updatedById_fkey` ON `ProductionRun`;

-- AlterTable
ALTER TABLE `Customer` MODIFY `updatedById` INTEGER NULL;

-- AlterTable
ALTER TABLE `Expense` MODIFY `updatedById` INTEGER NULL;

-- AlterTable
ALTER TABLE `InventoryItem` MODIFY `updatedById` INTEGER NULL;

-- AlterTable
ALTER TABLE `Product` MODIFY `updatedById` INTEGER NULL;

-- AlterTable
ALTER TABLE `ProductionRun` MODIFY `updatedById` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryItem` ADD CONSTRAINT `InventoryItem_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductionRun` ADD CONSTRAINT `ProductionRun_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
