/*
  Warnings:

  - You are about to alter the column `resetPasswordExpires` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `lastLogin` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `emailTokenExpires` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `completedAt` on the `userchapter` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `deliveredAt` on the `usernotification` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `readAt` on the `usernotification` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `completedAt` on the `userunit` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `lastWatchedAt` on the `videohistory` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `startedAt` on the `videohistory` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `lastWatchedAt` on the `videoprogress` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `startedAt` on the `videoprogress` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `completedAt` on the `videoprogress` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
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
ALTER TABLE `videohistory` MODIFY `lastWatchedAt` DATETIME NULL,
    MODIFY `startedAt` DATETIME NULL;

-- AlterTable
ALTER TABLE `videoprogress` MODIFY `lastWatchedAt` DATETIME NULL,
    MODIFY `startedAt` DATETIME NULL,
    MODIFY `completedAt` DATETIME NULL;

-- CreateTable
CREATE TABLE `RecordedClass` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `recordedAt` DATETIME NOT NULL,
    `topics` JSON NOT NULL,
    `url` VARCHAR(250) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRecordings` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `recordedClassId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserRecordings` ADD CONSTRAINT `UserRecordings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRecordings` ADD CONSTRAINT `UserRecordings_recordedClassId_fkey` FOREIGN KEY (`recordedClassId`) REFERENCES `RecordedClass`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
