import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import Student from '../common/types/Student';
import generateTimestamp from '../helper/functions/generateTimestamp';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import loggerMessages from '../helper/messages/loggerMessages';
import { Dayjs } from 'dayjs';

@Injectable()
export class StudentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async checkStudentExists(studentName: string): Promise<boolean> {
    try {
      const studentExists: Student = await this.prismaService.student.findFirst(
        {
          where: {
            name: studentName,
          },
        },
      );

      if (studentExists) {
        throw new ConflictException({
          message: httpMessages_EN.student.checkStudentExists.status_409,
          pid: process.pid,
          timestamp: generateTimestamp(),
        });
      }

      return false;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      const timestamp: Dayjs = generateTimestamp();

      this.logger.error({
        message: loggerMessages.student.checkStudentExists.status_409,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      });

      throw new InternalServerErrorException({
        message: httpMessages_EN.general.status_500,
        pid: process.pid,
        timestamp,
      });
    }
  }

  async registerStudent(studentData: Student): Promise<Return> {
    await this.checkStudentExists(studentData.name);

    try {
      const newStudent: Student = await this.prismaService.student.create({
        data: studentData,
      });

      this.logger.log({
        message: loggerMessages.student.registerStudent.status_201,
        data: newStudent,
      });

      return {
        message: httpMessages_EN.student.registerStudent.status_201,
        data: newStudent,
      };
    } catch (error) {
      const timestamp: Dayjs = generateTimestamp();

      this.logger.error({
        message: loggerMessages.student.registerStudent.status_500,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      });

      throw new InternalServerErrorException({
        message: httpMessages_EN.general.status_500,
        pid: process.pid,
        timestamp,
      });
    }
  }
}
