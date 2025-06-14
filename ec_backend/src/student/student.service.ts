import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import Student from '../common/types/Student';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import loggerMessages from '../helper/messages/loggerMessages';
import ExceptionMessage from '../common/types/ExceptionMessage';
import generateExceptionMessage from '../helper/functions/generateExceptionMessage';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import UpdateStudentDTO from './dto/UpdateStudent.dto';
import FetchByQueryDTO from './dto/FetchByQuery.student.dto';

@Injectable()
export class StudentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async throwIfStudentExists(studentName: string): Promise<void> {
    try {
      const studentExists: Student = await this.prismaService.student.findFirst(
        {
          where: {
            name: studentName,
          },
        },
      );

      if (studentExists) {
        const errorMessage: ExceptionMessage = generateExceptionMessage(
          httpMessages_EN.student.throwIfStudentExists.status_409,
        );
        this.logger.warn({
          message: errorMessage,
          data: studentExists,
        });

        throw new ConflictException(errorMessage);
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      handleInternalErrorException(
        loggerMessages.student.throwIfStudentExists.status_500,
        this.logger,
        error,
      );
    }
  }

  async registerStudent(studentData: Student): Promise<Return> {
    await this.throwIfStudentExists(studentData.name);

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
      handleInternalErrorException(
        loggerMessages.student.registerStudent.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchStudents(): Promise<Return> {
    try {
      const students: Student[] = await this.prismaService.student.findMany();

      if (students.length === 0) {
        throw new NotFoundException(
          generateExceptionMessage(
            httpMessages_EN.student.fetchStudents.status_404,
          ),
        );
      }

      return {
        message: httpMessages_EN.student.fetchStudents.status_200,
        data: students,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        loggerMessages.student.fetchStudents.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchStudentById(id: string): Promise<Return> {
    try {
      const student: Student =
        await this.prismaService.student.findUniqueOrThrow({
          where: {
            id,
          },
        });
      return {
        message: httpMessages_EN.student.fetchStudentById.status_200,
        data: student,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          generateExceptionMessage(
            httpMessages_EN.student.fetchStudentById.status_404,
          ),
        );
      }

      handleInternalErrorException(
        loggerMessages.student.fetchStudentById.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchStudentsByQuery(
    city: string,
    state: string,
    country: string,
  ): Promise<Return> {
    try {
      const students: Student[] = await this.prismaService.student.findMany({
        where: {
          OR: [{ city }, { state }, { country }],
        },
      });

      if (students.length === 0) {
        throw new NotFoundException(
          generateExceptionMessage(
            httpMessages_EN.student.fetchStudentsByQuery.status_404,
          ),
        );
      }
      return {
        message: httpMessages_EN.student.fetchStudentsByQuery.status_200,
        data: students,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        loggerMessages.student.fetchStudentsByQuery.status_500,
        this.logger,
        error,
      );
    }
  }

  async updateStudent(
    id: string,
    updatedData: UpdateStudentDTO,
  ): Promise<Return> {
    try {
      const updatedStudent: Student = await this.prismaService.student.update({
        where: {
          id,
        },
        data: updatedData,
      });

      this.logger.log({
        message: loggerMessages.student.updateStudent.status_200,
        data: updatedStudent,
      });

      return {
        message: httpMessages_EN.student.updateStudent.status_200,
        data: updatedStudent,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          generateExceptionMessage(
            httpMessages_EN.student.updateStudent.status_404,
          ),
        );
      }

      handleInternalErrorException(
        loggerMessages.student.updateStudent.status_500,
        this.logger,
        error,
      );
    }
  }

  async deleteStudent(id: string) {
    try {
      const deletedStudent: Student = await this.prismaService.student.delete({
        where: {
          id,
        },
      });

      return {
        message: httpMessages_EN.student.deleteStudent.status_200,
        data: deletedStudent,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          generateExceptionMessage(
            httpMessages_EN.student.deleteStudent.status_404,
          ),
        );
      }

      handleInternalErrorException(
        loggerMessages.student.deleteStudent.status_500,
        this.logger,
        error,
      );
    }
  }
}
