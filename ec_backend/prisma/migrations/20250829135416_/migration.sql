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
ALTER TABLE `videoprogress` MODIFY `lastWatchedAt` DATETIME NULL,
    MODIFY `startedAt` DATETIME NULL,
    MODIFY `completedAt` DATETIME NULL;

-- CreateTable
CREATE TABLE `QuizHistory` (
    `id` VARCHAR(191) NOT NULL,
    `quizId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `isTest` BOOLEAN NOT NULL DEFAULT false,
    `answers` JSON NOT NULL,
    `score` INTEGER NOT NULL,
    `isCompleted` BOOLEAN NOT NULL DEFAULT false,
    `feedback` TEXT NULL,
    `elapsedTime` INTEGER NOT NULL DEFAULT 0,
    `attemptNumber` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VideoHistory` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `videoId` VARCHAR(191) NOT NULL,
    `progress` INTEGER NOT NULL DEFAULT 0,
    `watchedDuration` INTEGER NOT NULL DEFAULT 0,
    `watchedCount` INTEGER NOT NULL DEFAULT 0,
    `lastWatchedAt` DATETIME NULL,
    `startedAt` DATETIME NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `QuizHistory` ADD CONSTRAINT `QuizHistory_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuizHistory` ADD CONSTRAINT `QuizHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoHistory` ADD CONSTRAINT `VideoHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoHistory` ADD CONSTRAINT `VideoHistory_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
