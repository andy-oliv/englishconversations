import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import AnsweredQuiz from '../common/types/AnsweredQuiz';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';
import { QuizService } from '../quiz/quiz.service';
import { StudentService } from '../student/student.service';
import generateExceptionMessage from '../helper/functions/generateExceptionMessage';

@Injectable()
export class AnsweredQuizService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
    private readonly quizService: QuizService,
    private readonly studentService: StudentService,
  ) {}

  async checkIsRetry(quizId: string, studentId: string): Promise<boolean> {
    try {
      const answerExists: AnsweredQuiz =
        await this.prismaService.answeredQuiz.findFirst({
          where: {
            AND: [{ quizId }, { studentId }],
          },
        });

      if (answerExists) {
        return true;
      }

      return false;
    } catch (error) {
      handleInternalErrorException(
        loggerMessages.answeredQuiz.checkIsRetry.status_500,
        this.logger,
        error,
      );
    }
  }

  async answerValidation(quizId: string, studentId: string): Promise<boolean> {
    await this.quizService.throwIfNotQuiz(quizId);
    await this.studentService.throwIfNotStudent(studentId);
    const retry: boolean = await this.checkIsRetry(quizId, studentId);

    return retry;
  }

  async saveAnswer(data: AnsweredQuiz): Promise<Return> {
    const retry: boolean = await this.answerValidation(
      data.quizId,
      data.studentId,
    );

    try {
      const answer: AnsweredQuiz = await this.prismaService.answeredQuiz.create(
        {
          data: {
            quizId: data.quizId,
            studentId: data.studentId,
            score: data.score,
            feedback: data.feedback,
            elapsedTime: data.elapsedTime,
            isRetry: retry,
          },
        },
      );

      return {
        message: httpMessages_EN.answeredQuiz.saveAnswer.status_201,
        data: answer,
      };
    } catch (error) {
      handleInternalErrorException(
        loggerMessages.answeredQuiz.saveAnswer.status_500,
        this.logger,
        error,
      );
    }
  }
}
