/*
  Warnings:

  - You are about to alter the column `resetPasswordExpires` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `lastLogin` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `completedAt` on the `userunit` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `thumbnail` on the `video` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `video` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - A unique constraint covering the columns `[thumbnailId]` on the table `Video` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chapterId` to the `Unit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `unit` ADD COLUMN `chapterId` VARCHAR(191) NOT NULL,
    MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `resetPasswordExpires` DATETIME NULL,
    MODIFY `lastLogin` DATETIME NULL;

-- AlterTable
ALTER TABLE `userunit` MODIFY `completedAt` DATETIME NULL;

-- AlterTable
ALTER TABLE `video` DROP COLUMN `thumbnail`,
    ADD COLUMN `thumbnailId` VARCHAR(191) NULL,
    MODIFY `title` VARCHAR(100) NOT NULL,
    MODIFY `description` TEXT NULL,
    MODIFY `url` VARCHAR(250) NOT NULL;

-- CreateTable
CREATE TABLE `Chapter` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Video_thumbnailId_key` ON `Video`(`thumbnailId`);

-- AddForeignKey
ALTER TABLE `Unit` ADD CONSTRAINT `Unit_chapterId_fkey` FOREIGN KEY (`chapterId`) REFERENCES `Chapter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Video` ADD CONSTRAINT `Video_thumbnailId_fkey` FOREIGN KEY (`thumbnailId`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
