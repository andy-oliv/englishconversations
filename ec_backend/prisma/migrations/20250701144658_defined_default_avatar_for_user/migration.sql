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
ALTER TABLE `user` MODIFY `avatarUrl` VARCHAR(250) NULL DEFAULT 'https://englishconversations-files.s3.us-east-1.amazonaws.com/images/user_placeholder.png',
    MODIFY `resetPasswordExpires` DATETIME NULL,
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
