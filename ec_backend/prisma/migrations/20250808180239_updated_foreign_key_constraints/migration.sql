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
-- DropForeignKey
ALTER TABLE `answeredexercise` DROP FOREIGN KEY `AnsweredExercise_answeredQuizId_fkey`;

-- DropForeignKey
ALTER TABLE `answeredexercise` DROP FOREIGN KEY `AnsweredExercise_exerciseId_fkey`;

-- DropForeignKey
ALTER TABLE `answeredquiz` DROP FOREIGN KEY `AnsweredQuiz_quizId_fkey`;

-- DropForeignKey
ALTER TABLE `answeredquiz` DROP FOREIGN KEY `AnsweredQuiz_userId_fkey`;

-- DropForeignKey
ALTER TABLE `exercisetag` DROP FOREIGN KEY `ExerciseTag_exerciseId_fkey`;

-- DropForeignKey
ALTER TABLE `exercisetag` DROP FOREIGN KEY `ExerciseTag_tagId_fkey`;

-- DropForeignKey
ALTER TABLE `loginlog` DROP FOREIGN KEY `LoginLog_userId_fkey`;

-- DropForeignKey
ALTER TABLE `quiztag` DROP FOREIGN KEY `QuizTag_quizId_fkey`;

-- DropForeignKey
ALTER TABLE `quiztag` DROP FOREIGN KEY `QuizTag_tagId_fkey`;

-- DropForeignKey
ALTER TABLE `slide` DROP FOREIGN KEY `Slide_slideshowId_fkey`;

-- DropForeignKey
ALTER TABLE `slideshowprogress` DROP FOREIGN KEY `SlideshowProgress_slideshowId_fkey`;

-- DropForeignKey
ALTER TABLE `slideshowprogress` DROP FOREIGN KEY `SlideshowProgress_userId_fkey`;

-- DropForeignKey
ALTER TABLE `unittag` DROP FOREIGN KEY `UnitTag_tagId_fkey`;

-- DropForeignKey
ALTER TABLE `unittag` DROP FOREIGN KEY `UnitTag_unitId_fkey`;

-- DropForeignKey
ALTER TABLE `userchapter` DROP FOREIGN KEY `UserChapter_chapterId_fkey`;

-- DropForeignKey
ALTER TABLE `userchapter` DROP FOREIGN KEY `UserChapter_userId_fkey`;

-- DropForeignKey
ALTER TABLE `usernotification` DROP FOREIGN KEY `UserNotification_notificationId_fkey`;

-- DropForeignKey
ALTER TABLE `usernotification` DROP FOREIGN KEY `UserNotification_userId_fkey`;

-- DropForeignKey
ALTER TABLE `userunit` DROP FOREIGN KEY `UserUnit_unitId_fkey`;

-- DropForeignKey
ALTER TABLE `userunit` DROP FOREIGN KEY `UserUnit_userId_fkey`;

-- DropForeignKey
ALTER TABLE `videoprogress` DROP FOREIGN KEY `VideoProgress_userId_fkey`;

-- DropForeignKey
ALTER TABLE `videoprogress` DROP FOREIGN KEY `VideoProgress_videoId_fkey`;

-- DropForeignKey
ALTER TABLE `videotag` DROP FOREIGN KEY `VideoTag_tagId_fkey`;

-- DropForeignKey
ALTER TABLE `videotag` DROP FOREIGN KEY `VideoTag_videoId_fkey`;

-- DropIndex
DROP INDEX `ExerciseTag_tagId_fkey` ON `exercisetag`;

-- DropIndex
DROP INDEX `LoginLog_userId_fkey` ON `loginlog`;

-- DropIndex
DROP INDEX `QuizTag_tagId_fkey` ON `quiztag`;

-- DropIndex
DROP INDEX `Slide_slideshowId_fkey` ON `slide`;

-- DropIndex
DROP INDEX `SlideshowProgress_slideshowId_fkey` ON `slideshowprogress`;

-- DropIndex
DROP INDEX `SlideshowProgress_userId_fkey` ON `slideshowprogress`;

-- DropIndex
DROP INDEX `UnitTag_tagId_fkey` ON `unittag`;

-- DropIndex
DROP INDEX `UserChapter_chapterId_fkey` ON `userchapter`;

-- DropIndex
DROP INDEX `UserNotification_notificationId_fkey` ON `usernotification`;

-- DropIndex
DROP INDEX `UserNotification_userId_fkey` ON `usernotification`;

-- DropIndex
DROP INDEX `UserUnit_unitId_fkey` ON `userunit`;

-- DropIndex
DROP INDEX `VideoProgress_videoId_fkey` ON `videoprogress`;

-- DropIndex
DROP INDEX `VideoTag_tagId_fkey` ON `videotag`;

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

-- AddForeignKey
ALTER TABLE `LoginLog` ADD CONSTRAINT `LoginLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnsweredExercise` ADD CONSTRAINT `AnsweredExercise_exerciseId_fkey` FOREIGN KEY (`exerciseId`) REFERENCES `Exercise`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnsweredExercise` ADD CONSTRAINT `AnsweredExercise_answeredQuizId_fkey` FOREIGN KEY (`answeredQuizId`) REFERENCES `AnsweredQuiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnsweredQuiz` ADD CONSTRAINT `AnsweredQuiz_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnsweredQuiz` ADD CONSTRAINT `AnsweredQuiz_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExerciseTag` ADD CONSTRAINT `ExerciseTag_exerciseId_fkey` FOREIGN KEY (`exerciseId`) REFERENCES `Exercise`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExerciseTag` ADD CONSTRAINT `ExerciseTag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuizTag` ADD CONSTRAINT `QuizTag_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuizTag` ADD CONSTRAINT `QuizTag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UnitTag` ADD CONSTRAINT `UnitTag_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `Unit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UnitTag` ADD CONSTRAINT `UnitTag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoTag` ADD CONSTRAINT `VideoTag_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoTag` ADD CONSTRAINT `VideoTag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserUnit` ADD CONSTRAINT `UserUnit_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserUnit` ADD CONSTRAINT `UserUnit_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `Unit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserChapter` ADD CONSTRAINT `UserChapter_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserChapter` ADD CONSTRAINT `UserChapter_chapterId_fkey` FOREIGN KEY (`chapterId`) REFERENCES `Chapter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoProgress` ADD CONSTRAINT `VideoProgress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoProgress` ADD CONSTRAINT `VideoProgress_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserNotification` ADD CONSTRAINT `UserNotification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserNotification` ADD CONSTRAINT `UserNotification_notificationId_fkey` FOREIGN KEY (`notificationId`) REFERENCES `Notification`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Slide` ADD CONSTRAINT `Slide_slideshowId_fkey` FOREIGN KEY (`slideshowId`) REFERENCES `Slideshow`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SlideshowProgress` ADD CONSTRAINT `SlideshowProgress_slideshowId_fkey` FOREIGN KEY (`slideshowId`) REFERENCES `Slideshow`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SlideshowProgress` ADD CONSTRAINT `SlideshowProgress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
