import { Module } from '@nestjs/common';
import { AnsweredQuizController } from './answered-quiz.controller';
import { AnsweredQuizService } from './answered-quiz.service';
import { PrismaModule } from '../prisma/prisma.module';
import { QuizModule } from '../quiz/quiz.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, QuizModule, UserModule],
  controllers: [AnsweredQuizController],
  providers: [AnsweredQuizService],
  exports: [AnsweredQuizService],
})
export class AnsweredQuizModule {}
