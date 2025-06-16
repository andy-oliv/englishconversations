import { Module } from '@nestjs/common';
import { AnsweredQuizController } from './answered-quiz.controller';
import { AnsweredQuizService } from './answered-quiz.service';
import { PrismaModule } from '../prisma/prisma.module';
import { QuizModule } from '../quiz/quiz.module';
import { StudentModule } from '../student/student.module';

@Module({
  imports: [PrismaModule, QuizModule, StudentModule],
  controllers: [AnsweredQuizController],
  providers: [AnsweredQuizService],
})
export class AnsweredQuizModule {}
