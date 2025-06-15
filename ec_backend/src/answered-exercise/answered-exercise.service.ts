import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import AnsweredExercise from '../common/types/AnsweredExercise';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import { StudentService } from '../student/student.service';
import { ExerciseService } from '../exercise/exercise.service';
import { QuizService } from '../quiz/quiz.service';
import Exercise from '../common/types/Exercise';
import { isEqual } from 'lodash';

@Injectable()
export class AnsweredExerciseService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
    private readonly studentService: StudentService,
    private readonly exerciseService: ExerciseService,
    private readonly quizService: QuizService,
  ) {}

  async checkIfAnswered(
    exerciseId: number,
    studentId: string,
  ): Promise<boolean> {
    try {
      const answerExists: AnsweredExercise =
        await this.prismaService.answeredExercise.findFirst({
          where: {
            AND: [{ exerciseId }, { studentId }],
          },
        });

      if (answerExists) {
        return true;
      }
      return false;
    } catch (error) {
      handleInternalErrorException(
        loggerMessages.answeredExercise.checkIfAnswered.status_500,
        this.logger,
        error,
      );
    }
  }

  async saveAnswer(data: AnsweredExercise): Promise<Return> {
    await this.studentService.throwIfNotStudent(data.studentId);

    if (data.quizId) {
      await this.quizService.throwIfNotQuiz(data.quizId);
    }

    const exercise: Exercise = await this.exerciseService.fetchExercise(
      data.exerciseId,
    );
    const alreadyAnswered: boolean = await this.checkIfAnswered(
      data.exerciseId,
      data.studentId,
    );

    try {
      const exerciseAnswer: AnsweredExercise =
        await this.prismaService.answeredExercise.create({
          data: {
            exerciseId: data.exerciseId,
            studentId: data.studentId,
            quizId: data.quizId,
            isRetry: alreadyAnswered,
            selectedAnswers: data.selectedAnswers,
            textAnswer: data.textAnswer,
            audioUrl: data.audioUrl,
            isCorrectAnswer: isEqual(
              exercise.correctAnswer,
              data.selectedAnswers,
            ),
            feedback: data.feedback,
            elapsedTime: data.elapsedTime,
          },
        });

      return {
        message: httpMessages_EN.answeredExercise.saveAnswer.status_201,
        data: exerciseAnswer,
      };
    } catch (error) {
      handleInternalErrorException(
        loggerMessages.answeredExercise.saveAnswer.status_500,
        this.logger,
        error,
      );
    }
  }
}
