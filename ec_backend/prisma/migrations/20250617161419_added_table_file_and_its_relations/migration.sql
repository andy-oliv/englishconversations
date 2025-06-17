/*
  Warnings:

  - You are about to drop the column `audioUrl` on the `answeredexercise` table. All the data in the column will be lost.
  - You are about to drop the column `contentUrl` on the `exercise` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `quiz` table. All the data in the column will be lost.
  - You are about to alter the column `resetPasswordExpires` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `lastLogin` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `completedAt` on the `userunit` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - A unique constraint covering the columns `[fileId]` on the table `AnsweredExercise` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fileId]` on the table `Exercise` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fileId]` on the table `Quiz` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `answeredexercise` DROP COLUMN `audioUrl`,
    ADD COLUMN `fileId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `exercise` DROP COLUMN `contentUrl`,
    ADD COLUMN `fileId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `quiz` DROP COLUMN `imageUrl`,
    ADD COLUMN `fileId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `resetPasswordExpires` DATETIME NULL,
    MODIFY `lastLogin` DATETIME NULL;

-- AlterTable
ALTER TABLE `userunit` MODIFY `completedAt` DATETIME NULL;

-- CreateTable
CREATE TABLE `File` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(250) NOT NULL,
    `type` ENUM('PDF', 'AUDIO', 'IMAGE') NOT NULL,
    `url` VARCHAR(250) NOT NULL,
    `size` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `AnsweredExercise_fileId_key` ON `AnsweredExercise`(`fileId`);

-- CreateIndex
CREATE UNIQUE INDEX `Exercise_fileId_key` ON `Exercise`(`fileId`);

-- CreateIndex
CREATE UNIQUE INDEX `Quiz_fileId_key` ON `Quiz`(`fileId`);

-- AddForeignKey
ALTER TABLE `Exercise` ADD CONSTRAINT `Exercise_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnsweredExercise` ADD CONSTRAINT `AnsweredExercise_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quiz` ADD CONSTRAINT `Quiz_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
