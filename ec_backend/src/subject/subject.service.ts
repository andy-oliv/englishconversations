import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';
import Subject from '../entities/Subject';
import httpMessages_EN from '../helper/messages/httpMessages.en';

@Injectable()
export class SubjectService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async createSubject(title: string): Promise<Return> {
    try {
      const newSubject: Subject = await this.prismaService.subject.create({
        data: {
          title,
        },
      });

      return {
        message: httpMessages_EN.subject.createSubject.status_201,
        data: newSubject,
      };
    } catch (error) {
      handleInternalErrorException(
        'SubjectService',
        'createSubject',
        loggerMessages.subject.createSubject.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchSubjects(): Promise<Return> {
    try {
      const subjects: Subject[] = await this.prismaService.subject.findMany();

      if (subjects.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.subject.fetchSubjects.status_404,
        );
      }
      return {
        message: httpMessages_EN.subject.fetchSubjects.status_200,
        data: subjects,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'SubjectService',
        'fetchSubjects',
        loggerMessages.subject.fetchSubjects.status_500,
        this.logger,
        error,
      );
    }
  }

  async deleteSubject(subjectId: number): Promise<Return> {
    try {
      const deletedSubject: Subject = await this.prismaService.subject.delete({
        where: {
          id: subjectId,
        },
      });

      return {
        message: httpMessages_EN.subject.deleteSubject.status_200,
        data: deletedSubject,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.subject.deleteSubject.status_404,
        );
      }

      handleInternalErrorException(
        'SubjectService',
        'deleteSubject',
        loggerMessages.subject.deleteSubject.status_500,
        this.logger,
        error,
      );
    }
  }
}
