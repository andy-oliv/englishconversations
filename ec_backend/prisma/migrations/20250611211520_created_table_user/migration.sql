-- AlterTable
ALTER TABLE `exercise` MODIFY `type` ENUM('FILL_IN_THE_BLANKS', 'MULTIPLE_CHOICE_QUESTION', 'CORRECT_OR_INCORRECT', 'MATCH_THE_COLUMNS', 'UNSCRAMBLE_WORD', 'UNSCRAMBLE_SENTENCE', 'LISTENING_COMPREHENSION', 'PICTIONARY', 'FREE_ANSWER_QUESTION', 'TRANSLATION', 'SPEAKING_EXERCISE', 'VIDEO_QUESTION') NOT NULL;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `bio` TEXT NULL,
    `city` VARCHAR(50) NULL,
    `state` VARCHAR(50) NULL,
    `country` VARCHAR(50) NULL,
    `avatarUrl` VARCHAR(250) NULL,
    `languageLevel` ENUM('A1', 'A2', 'B1', 'B2', 'C1') NOT NULL DEFAULT 'A1',
    `email` VARCHAR(250) NOT NULL,
    `isEmailVerified` BOOLEAN NOT NULL DEFAULT false,
    `emailVerificationToken` VARCHAR(64) NULL,
    `password` VARCHAR(255) NOT NULL,
    `refreshToken` TEXT NULL,
    `passwordResetToken` VARCHAR(64) NULL,
    `resetPasswordExpires` DATETIME NULL,
    `role` ENUM('ADMIN', 'STUDENT') NOT NULL,
    `lastLogin` DATETIME NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
