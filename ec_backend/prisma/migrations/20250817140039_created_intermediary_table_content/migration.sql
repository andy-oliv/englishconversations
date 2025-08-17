/*
  Warnings:

  - You are about to drop the column `unitId` on the `quiz` table. All the data in the column will be lost.
  - You are about to drop the column `unitId` on the `slideshow` table. All the data in the column will be lost.
  - You are about to alter the column `resetPasswordExpires` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `lastLogin` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `emailTokenExpires` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `completedAt` on the `userchapter` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `deliveredAt` on the `usernotification` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `readAt` on the `usernotification` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `completedAt` on the `userunit` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `unitId` on the `video` table. All the data in the column will be lost.
  - You are about to alter the column `lastWatchedAt` on the `videoprogress` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `startedAt` on the `videoprogress` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `completedAt` on the `videoprogress` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- DropForeignKey
ALTER TABLE `quiz` DROP FOREIGN KEY `Quiz_unitId_fkey`;

-- DropForeignKey
ALTER TABLE `slideshow` DROP FOREIGN KEY `Slideshow_unitId_fkey`;

-- DropForeignKey
ALTER TABLE `video` DROP FOREIGN KEY `Video_unitId_fkey`;

-- DropIndex
DROP INDEX `Quiz_unitId_fkey` ON `quiz`;

-- DropIndex
DROP INDEX `Slideshow_unitId_fkey` ON `slideshow`;

-- DropIndex
DROP INDEX `Video_unitId_fkey` ON `video`;

-- AlterTable
ALTER TABLE `quiz` DROP COLUMN `unitId`;

-- AlterTable
ALTER TABLE `slideshow` DROP COLUMN `unitId`;

-- AlterTable
ALTER TABLE `user` MODIFY `resetPasswordExpires` DATETIME NULL,
    MODIFY `lastLogin` DATETIME NULL,
    MODIFY `emailTokenExpires` DATETIME NULL;

-- AlterTable
ALTER TABLE `userchapter` MODIFY `completedAt` DATETIME NULL;

-- AlterTable
ALTER TABLE `usernotification` MODIFY `deliveredAt` DATETIME NOT NULL,
    MODIFY `readAt` DATETIME NULL;

-- AlterTable
ALTER TABLE `userunit` MODIFY `completedAt` DATETIME NULL;

-- AlterTable
ALTER TABLE `video` DROP COLUMN `unitId`;

-- AlterTable
ALTER TABLE `videoprogress` MODIFY `lastWatchedAt` DATETIME NULL,
    MODIFY `startedAt` DATETIME NULL,
    MODIFY `completedAt` DATETIME NULL;

-- CreateTable
CREATE TABLE `Content` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `unitId` INTEGER NOT NULL,
    `contentType` ENUM('VIDEO', 'SLIDESHOW', 'QUIZ', 'TEST') NOT NULL,
    `videoId` VARCHAR(191) NULL,
    `slideshowId` VARCHAR(191) NULL,
    `quizId` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL,

    UNIQUE INDEX `Content_videoId_key`(`videoId`),
    UNIQUE INDEX `Content_slideshowId_key`(`slideshowId`),
    UNIQUE INDEX `Content_quizId_key`(`quizId`),
    UNIQUE INDEX `Content_unitId_order_key`(`unitId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Content` ADD CONSTRAINT `Content_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `Unit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Content` ADD CONSTRAINT `Content_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Content` ADD CONSTRAINT `Content_slideshowId_fkey` FOREIGN KEY (`slideshowId`) REFERENCES `Slideshow`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Content` ADD CONSTRAINT `Content_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
