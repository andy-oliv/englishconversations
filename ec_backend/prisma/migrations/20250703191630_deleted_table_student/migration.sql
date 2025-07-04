/*
  Warnings:

  - You are about to drop the column `studentId` on the `answeredexercise` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `answeredquiz` table. All the data in the column will be lost.
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
  - You are about to drop the `student` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `AnsweredExercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `AnsweredQuiz` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `answeredexercise` DROP FOREIGN KEY `AnsweredExercise_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `answeredquiz` DROP FOREIGN KEY `AnsweredQuiz_studentId_fkey`;

-- DropIndex
DROP INDEX `AnsweredExercise_studentId_idx` ON `answeredexercise`;

-- DropIndex
DROP INDEX `AnsweredQuiz_studentId_idx` ON `answeredquiz`;

-- DropIndex
DROP INDEX `AnsweredQuiz_studentId_quizId_idx` ON `answeredquiz`;

-- AlterTable
ALTER TABLE `answeredexercise` DROP COLUMN `studentId`,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `answeredquiz` DROP COLUMN `studentId`,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `birthdate` DATE NULL,
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

-- DropTable
DROP TABLE `student`;

-- CreateIndex
CREATE INDEX `AnsweredExercise_userId_idx` ON `AnsweredExercise`(`userId`);

-- CreateIndex
CREATE INDEX `AnsweredQuiz_userId_idx` ON `AnsweredQuiz`(`userId`);

-- CreateIndex
CREATE INDEX `AnsweredQuiz_userId_quizId_idx` ON `AnsweredQuiz`(`userId`, `quizId`);

-- CreateIndex
CREATE INDEX `User_city_idx` ON `User`(`city`);

-- CreateIndex
CREATE INDEX `User_state_idx` ON `User`(`state`);

-- CreateIndex
CREATE INDEX `User_country_idx` ON `User`(`country`);

-- AddForeignKey
ALTER TABLE `AnsweredExercise` ADD CONSTRAINT `AnsweredExercise_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnsweredQuiz` ADD CONSTRAINT `AnsweredQuiz_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
