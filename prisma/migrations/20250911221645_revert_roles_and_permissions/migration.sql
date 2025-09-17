/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `permissions` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `permissions` TEXT NOT NULL,
    ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'cashier',
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'active';
