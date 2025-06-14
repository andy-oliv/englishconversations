/*
  Warnings:

  - You are about to alter the column `resetPasswordExpires` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `lastLogin` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `completedAt` on the `userunit` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `exercise` MODIFY `options` JSON NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `resetPasswordExpires` DATETIME NULL,
    MODIFY `lastLogin` DATETIME NULL;

-- AlterTable
ALTER TABLE `userunit` MODIFY `completedAt` DATETIME NULL;
