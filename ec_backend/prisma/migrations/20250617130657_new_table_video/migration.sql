/*
  Warnings:

  - You are about to drop the column `grammarTopics` on the `unit` table. All the data in the column will be lost.
  - You are about to alter the column `resetPasswordExpires` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `lastLogin` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `completedAt` on the `userunit` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `unit` DROP COLUMN `grammarTopics`;

-- AlterTable
ALTER TABLE `user` MODIFY `resetPasswordExpires` DATETIME NULL,
    MODIFY `lastLogin` DATETIME NULL;

-- AlterTable
ALTER TABLE `userunit` MODIFY `completedAt` DATETIME NULL;

-- CreateTable
CREATE TABLE `VideoTag` (
    `videoId` VARCHAR(191) NOT NULL,
    `tagId` INTEGER NOT NULL,

    PRIMARY KEY (`videoId`, `tagId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Video` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `url` VARCHAR(191) NOT NULL,
    `duration` INTEGER NULL,
    `thumbnail` VARCHAR(191) NULL,
    `unitId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VideoTag` ADD CONSTRAINT `VideoTag_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoTag` ADD CONSTRAINT `VideoTag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Video` ADD CONSTRAINT `Video_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `Unit`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
