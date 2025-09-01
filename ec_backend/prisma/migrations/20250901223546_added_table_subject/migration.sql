/*
  Warnings:

  - You are about to drop the column `topics` on the `recordedclass` table. All the data in the column will be lost.
  - You are about to alter the column `recordedAt` on the `recordedclass` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
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
  - Added the required column `subjectId` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectId` to the `RecordedClass` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `material` ADD COLUMN `subjectId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `recordedclass` DROP COLUMN `topics`,
    ADD COLUMN `subjectId` INTEGER NOT NULL,
    MODIFY `recordedAt` DATETIME NOT NULL;

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
CREATE TABLE `Subject` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RecordedClass` ADD CONSTRAINT `RecordedClass_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Material` ADD CONSTRAINT `Material_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
