/*
  Warnings:

  - You are about to alter the column `resetPasswordExpires` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `lastLogin` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `emailTokenExpires` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `completedAt` on the `userchapter` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `deliveredAt` on the `usernotification` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `readAt` on the `usernotification` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `completedAt` on the `userunit` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `lastWatchedAt` on the `videoprogress` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `startedAt` on the `videoprogress` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `completedAt` on the `videoprogress` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - A unique constraint covering the columns `[userContentId]` on the table `AnsweredQuiz` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userContentId]` on the table `SlideshowProgress` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userContentId]` on the table `VideoProgress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userContentId` to the `AnsweredQuiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userContentId` to the `SlideshowProgress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `VideoProgress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userContentId` to the `VideoProgress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `answeredquiz` ADD COLUMN `userContentId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `slideshowprogress` ADD COLUMN `userContentId` INTEGER NOT NULL;

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
ALTER TABLE `videoprogress` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `userContentId` INTEGER NOT NULL,
    MODIFY `lastWatchedAt` DATETIME NULL,
    MODIFY `startedAt` DATETIME NULL,
    MODIFY `completedAt` DATETIME NULL;

-- CreateTable
CREATE TABLE `UserContent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `contentId` INTEGER NOT NULL,
    `status` ENUM('LOCKED', 'IN_PROGRESS', 'COMPLETED') NOT NULL,
    `progress` DOUBLE NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `AnsweredQuiz_userContentId_key` ON `AnsweredQuiz`(`userContentId`);

-- CreateIndex
CREATE UNIQUE INDEX `SlideshowProgress_userContentId_key` ON `SlideshowProgress`(`userContentId`);

-- CreateIndex
CREATE UNIQUE INDEX `VideoProgress_userContentId_key` ON `VideoProgress`(`userContentId`);

-- AddForeignKey
ALTER TABLE `AnsweredQuiz` ADD CONSTRAINT `AnsweredQuiz_userContentId_fkey` FOREIGN KEY (`userContentId`) REFERENCES `UserContent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoProgress` ADD CONSTRAINT `VideoProgress_userContentId_fkey` FOREIGN KEY (`userContentId`) REFERENCES `UserContent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SlideshowProgress` ADD CONSTRAINT `SlideshowProgress_userContentId_fkey` FOREIGN KEY (`userContentId`) REFERENCES `UserContent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserContent` ADD CONSTRAINT `UserContent_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserContent` ADD CONSTRAINT `UserContent_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `Content`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
