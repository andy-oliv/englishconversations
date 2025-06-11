-- CreateTable
CREATE TABLE `Student` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `age` INTEGER NOT NULL,
    `birthdate` DATE NOT NULL,
    `city` VARCHAR(50) NOT NULL,
    `state` VARCHAR(50) NOT NULL,
    `country` VARCHAR(50) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Student_city_idx`(`city`),
    INDEX `Student_state_idx`(`state`),
    INDEX `Student_country_idx`(`country`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Exercise` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('FILL_IN_THE_BLANKS', 'MULTIPLE_CHOICE_QUESTION', 'CORRECT_OR_INCORRECT', 'MATCH_THE_COLUMNS', 'UNSCRAMBLE_WORD', 'UNSCRAMBLE_SENTENCE', 'LISTENING_COMPREHENSION', 'PICTIONARY', 'FREE_ANSWER_QUESTION') NOT NULL,
    `description` TEXT NOT NULL,
    `level` ENUM('A1', 'A2', 'B1', 'B2', 'C1') NOT NULL,
    `difficulty` ENUM('EASY', 'MEDIUM', 'HARD') NOT NULL,
    `options` JSON NOT NULL,
    `correctAnswer` JSON NOT NULL,
    `quizId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Exercise_level_idx`(`level`),
    INDEX `Exercise_difficulty_idx`(`difficulty`),
    INDEX `Exercise_quizId_idx`(`quizId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnsweredExercise` (
    `id` VARCHAR(191) NOT NULL,
    `exerciseId` INTEGER NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `quizId` VARCHAR(191) NULL,
    `isRetry` BOOLEAN NOT NULL DEFAULT false,
    `selectedAnswers` JSON NULL,
    `textAnswer` VARCHAR(255) NULL,
    `audioUrl` VARCHAR(150) NULL,
    `isCorrectAnswer` BOOLEAN NOT NULL DEFAULT false,
    `feedback` TEXT NULL,
    `elapsedTime` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `AnsweredExercise_studentId_idx`(`studentId`),
    INDEX `AnsweredExercise_exerciseId_idx`(`exerciseId`),
    INDEX `AnsweredExercise_quizId_idx`(`quizId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Quiz` (
    `id` VARCHAR(191) NOT NULL,
    `isTest` BOOLEAN NOT NULL DEFAULT false,
    `title` VARCHAR(50) NOT NULL,
    `description` TEXT NOT NULL,
    `imageUrl` VARCHAR(150) NULL,
    `level` ENUM('A1', 'A2', 'B1', 'B2', 'C1') NOT NULL,
    `difficulty` ENUM('EASY', 'MEDIUM', 'HARD') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Quiz_level_idx`(`level`),
    INDEX `Quiz_difficulty_idx`(`difficulty`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnsweredQuiz` (
    `id` VARCHAR(191) NOT NULL,
    `quizId` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `score` INTEGER NOT NULL,
    `feedback` TEXT NULL,
    `elapsedTime` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `AnsweredQuiz_studentId_idx`(`studentId`),
    INDEX `AnsweredQuiz_quizId_idx`(`quizId`),
    INDEX `AnsweredQuiz_studentId_quizId_idx`(`studentId`, `quizId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Exercise` ADD CONSTRAINT `Exercise_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnsweredExercise` ADD CONSTRAINT `AnsweredExercise_exerciseId_fkey` FOREIGN KEY (`exerciseId`) REFERENCES `Exercise`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnsweredExercise` ADD CONSTRAINT `AnsweredExercise_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnsweredExercise` ADD CONSTRAINT `AnsweredExercise_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `AnsweredQuiz`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnsweredQuiz` ADD CONSTRAINT `AnsweredQuiz_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnsweredQuiz` ADD CONSTRAINT `AnsweredQuiz_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
