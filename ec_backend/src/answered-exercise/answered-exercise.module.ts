import { Module } from '@nestjs/common';
import { AnsweredExerciseController } from './answered-exercise.controller';
import { AnsweredExerciseService } from './answered-exercise.service';
import { PrismaModule } from '../prisma/prisma.module';
import { QuizModule } from '../quiz/quiz.module';
import { ExerciseModule } from '../exercise/exercise.module';
import { UserModule } from '../user/user.module';
import { AnsweredQuizModule } from '../answered-quiz/answered-quiz.module';

@Module({
  imports: [
    PrismaModule,
    QuizModule,
    ExerciseModule,
    UserModule,
    AnsweredQuizModule,
  ],
  controllers: [AnsweredExerciseController],
  providers: [AnsweredExerciseService],
})
export class AnsweredExerciseModule {}
