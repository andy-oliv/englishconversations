/*
  Warnings:

  - You are about to drop the column `fileId` on the `answeredexercise` table. All the data in the column will be lost.
  - You are about to drop the column `fileId` on the `chapter` table. All the data in the column will be lost.
  - You are about to drop the column `fileId` on the `exercise` table. All the data in the column will be lost.
  - You are about to drop the column `fileId` on the `quiz` table. All the data in the column will be lost.
  - You are about to drop the column `fileId` on the `unit` table. All the data in the column will be lost.
  - You are about to alter the column `resetPasswordExpires` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `lastLogin` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `emailTokenExpires` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `completedAt` on the `userchapter` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `deliveredAt` on the `usernotification` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `readAt` on the `usernotification` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `completedAt` on the `userunit` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `thumbnailId` on the `video` table. All the data in the column will be lost.
  - You are about to alter the column `lastWatchedAt` on the `videoprogress` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `startedAt` on the `videoprogress` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `completedAt` on the `videoprogress` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the `file` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `answeredexercise` DROP FOREIGN KEY `AnsweredExercise_fileId_fkey`;

-- DropForeignKey
ALTER TABLE `chapter` DROP FOREIGN KEY `Chapter_fileId_fkey`;

-- DropForeignKey
ALTER TABLE `exercise` DROP FOREIGN KEY `Exercise_fileId_fkey`;

-- DropForeignKey
ALTER TABLE `quiz` DROP FOREIGN KEY `Quiz_fileId_fkey`;

-- DropForeignKey
ALTER TABLE `unit` DROP FOREIGN KEY `Unit_fileId_fkey`;

-- DropForeignKey
ALTER TABLE `video` DROP FOREIGN KEY `Video_thumbnailId_fkey`;

-- DropIndex
DROP INDEX `AnsweredExercise_fileId_key` ON `answeredexercise`;

-- DropIndex
DROP INDEX `Chapter_fileId_key` ON `chapter`;

-- DropIndex
DROP INDEX `Exercise_fileId_key` ON `exercise`;

-- DropIndex
DROP INDEX `Quiz_fileId_key` ON `quiz`;

-- DropIndex
DROP INDEX `Unit_fileId_key` ON `unit`;

-- DropIndex
DROP INDEX `Video_thumbnailId_key` ON `video`;

-- AlterTable
ALTER TABLE `answeredexercise` DROP COLUMN `fileId`;

-- AlterTable
ALTER TABLE `chapter` DROP COLUMN `fileId`,
    ADD COLUMN `imageUrl` VARCHAR(250) NULL;

-- AlterTable
ALTER TABLE `exercise` DROP COLUMN `fileId`;

-- AlterTable
ALTER TABLE `quiz` DROP COLUMN `fileId`,
    ADD COLUMN `imageUrl` VARCHAR(250) NULL;

-- AlterTable
ALTER TABLE `unit` DROP COLUMN `fileId`,
    ADD COLUMN `imageUrl` VARCHAR(250) NULL;

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
ALTER TABLE `video` DROP COLUMN `thumbnailId`,
    ADD COLUMN `thumbnailUrl` VARCHAR(250) NULL;

-- AlterTable
ALTER TABLE `videoprogress` MODIFY `lastWatchedAt` DATETIME NULL,
    MODIFY `startedAt` DATETIME NULL,
    MODIFY `completedAt` DATETIME NULL;

-- DropTable
DROP TABLE `file`;
