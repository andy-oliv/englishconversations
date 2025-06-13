import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import generateMockStudent from '../helper/mocks/generateMockStudent';
import Student from '../common/types/Student';
import loggerMessages from '../helper/messages/loggerMessages';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('StudentService', () => {
  let studentService: StudentService;
  let prismaService: PrismaService;
  let logger: Logger;
  let students: Student[];
  let emptyStudentList: Student[];
  let student: Student;
  let error: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: PrismaService,
          useValue: {
            student: {
              create: jest.fn(),
              findFirst: jest.fn(),
              findMany: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    studentService = module.get<StudentService>(StudentService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<Logger>(Logger);

    students = [generateMockStudent(), generateMockStudent()];
    student = generateMockStudent();
    error = {
      code: 'P2025',
    };
    emptyStudentList = [];
  });

  it('should be defined', () => {
    expect(studentService).toBeDefined();
  });

  describe('registerStudent()', () => {
    it('should register a new student', async () => {
      jest
        .spyOn(studentService, 'throwIfStudentExists')
        .mockResolvedValue(undefined);
      (prismaService.student.create as jest.Mock).mockResolvedValue(student);
      (logger.log as jest.Mock).mockResolvedValue(
        loggerMessages.student.registerStudent.status_201,
      );

      const resolution: Return = await studentService.registerStudent(student);

      expect(resolution).toMatchObject({
        message: httpMessages_EN.student.registerStudent.status_201,
        data: student,
      });
      expect(studentService.throwIfStudentExists).toHaveBeenCalledWith(
        student.name,
      );
      expect(prismaService.student.create).toHaveBeenCalledWith({
        data: student,
      });
      expect(logger.log).toHaveBeenLastCalledWith({
        message: loggerMessages.student.registerStudent.status_201,
        data: student,
      });
    });

    it('should return a ConflictException because the student already exists', async () => {
      jest
        .spyOn(studentService, 'throwIfStudentExists')
        .mockRejectedValue(new ConflictException());

      await expect(studentService.registerStudent(student)).rejects.toThrow(
        new ConflictException(),
      );

      expect(studentService.throwIfStudentExists).toHaveBeenCalledWith(
        student.name,
      );
    });

    it('should return an InternalServerErrorException when calling the throwIfStudentExists() function', async () => {
      const student: Student = generateMockStudent();

      jest
        .spyOn(studentService, 'throwIfStudentExists')
        .mockRejectedValue(new InternalServerErrorException());

      await expect(studentService.registerStudent(student)).rejects.toThrow(
        new InternalServerErrorException(),
      );

      expect(studentService.throwIfStudentExists).toHaveBeenCalledWith(
        student.name,
      );
    });

    it('should throw an InternalServerErrorException when creating the new student', async () => {
      jest
        .spyOn(studentService, 'throwIfStudentExists')
        .mockResolvedValue(undefined);
      (prismaService.student.create as jest.Mock).mockResolvedValue(student);
      (logger.log as jest.Mock).mockResolvedValue(
        loggerMessages.student.registerStudent.status_201,
      );

      const resolution: Return = await studentService.registerStudent(student);

      expect(resolution).toMatchObject({
        message: httpMessages_EN.student.registerStudent.status_201,
        data: student,
      });
      expect(studentService.throwIfStudentExists).toHaveBeenCalledWith(
        student.name,
      );
      expect(prismaService.student.create).toHaveBeenCalledWith({
        data: student,
      });
      expect(logger.log).toHaveBeenLastCalledWith({
        message: loggerMessages.student.registerStudent.status_201,
        data: student,
      });
    });
  });

  describe('fetchStudents()', () => {
    it('should fetch all students', async () => {
      (prismaService.student.findMany as jest.Mock).mockResolvedValue(students);

      const resolution: Return = await studentService.fetchStudents();

      expect(resolution).toMatchObject({
        message: httpMessages_EN.student.fetchStudents.status_200,
        data: students,
      });

      expect(prismaService.student.findMany).toHaveBeenCalled();
    });

    it('should return a NotFoundException', async () => {
      (prismaService.student.findMany as jest.Mock).mockResolvedValue(
        emptyStudentList,
      );

      await expect(studentService.fetchStudents()).rejects.toThrow(
        new NotFoundException(httpMessages_EN.student.fetchStudents.status_404),
      );

      expect(prismaService.student.findMany).toHaveBeenCalled();
    });

    it('should return an InternalServerErrorException', async () => {
      (prismaService.student.findMany as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(),
      );

      await expect(studentService.fetchStudents()).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(prismaService.student.findMany).toHaveBeenCalled();
    });
  });

  describe('fetchStudentById()', () => {
    it('should fetch a student', async () => {
      (prismaService.student.findUniqueOrThrow as jest.Mock).mockResolvedValue(
        student,
      );

      const resolution: Return = await studentService.fetchStudentById(
        student.id,
      );

      expect(resolution).toMatchObject({
        message: httpMessages_EN.student.fetchStudentById.status_200,
        data: student,
      });
      expect(prismaService.student.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: student.id,
        },
      });
    });

    it('should throw a NotFoundException', async () => {
      (prismaService.student.findUniqueOrThrow as jest.Mock).mockRejectedValue(
        error,
      );

      await expect(studentService.fetchStudentById(student.id)).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.student.fetchStudentById.status_404,
        ),
      );

      expect(prismaService.student.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: student.id,
        },
      });
    });

    it('should throw an InternalServerErrorException', async () => {
      (prismaService.student.findUniqueOrThrow as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(),
      );

      await expect(studentService.fetchStudentById(student.id)).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(prismaService.student.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: student.id,
        },
      });
    });
  });

  describe('fetchStudentsByQuery()', () => {
    it('should throw students by query', async () => {
      (prismaService.student.findMany as jest.Mock).mockResolvedValue(students);

      const resolution: Return = await studentService.fetchStudentsByQuery(
        student.city,
        student.state,
        student.country,
      );

      expect(resolution).toMatchObject({
        message: httpMessages_EN.student.fetchStudentsByQuery.status_200,
        data: students,
      });
      expect(prismaService.student.findMany).toHaveBeenCalled();
    });

    it('should throw a NotFoundException', async () => {
      (prismaService.student.findMany as jest.Mock).mockResolvedValue(
        emptyStudentList,
      );

      await expect(
        studentService.fetchStudentsByQuery(
          student.city,
          student.state,
          student.country,
        ),
      ).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.student.fetchStudentsByQuery.status_404,
        ),
      );
      expect(prismaService.student.findMany).toHaveBeenCalled();
    });

    it('should throw an InternalServerErrorException', async () => {
      (prismaService.student.findMany as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(),
      );

      await expect(
        studentService.fetchStudentsByQuery(
          student.city,
          student.state,
          student.country,
        ),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );
      expect(prismaService.student.findMany).toHaveBeenCalled();
    });
  });

  describe('updateStudent()', () => {
    it('should update a student register', async () => {
      (prismaService.student.update as jest.Mock).mockResolvedValue(student);

      const resolution: Return = await studentService.updateStudent(
        student.id,
        student,
      );

      expect(resolution).toMatchObject({
        message: httpMessages_EN.student.updateStudent.status_200,
        data: student,
      });
      expect(prismaService.student.update).toHaveBeenCalledWith({
        where: {
          id: student.id,
        },
        data: student,
      });
    });

    it('should throw a NotFoundException', async () => {
      (prismaService.student.update as jest.Mock).mockRejectedValue(error);

      await expect(
        studentService.updateStudent(student.id, student),
      ).rejects.toThrow(
        new NotFoundException(httpMessages_EN.student.updateStudent.status_404),
      );
      expect(prismaService.student.update).toHaveBeenCalledWith({
        where: {
          id: student.id,
        },
        data: student,
      });
    });

    it('should throw an InternalServerErrorException', async () => {
      (prismaService.student.update as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(),
      );

      await expect(
        studentService.updateStudent(student.id, student),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );
      expect(prismaService.student.update).toHaveBeenCalledWith({
        where: {
          id: student.id,
        },
        data: student,
      });
    });
  });
  describe('deleteStudent()', () => {
    it('should delete a student register', async () => {
      (prismaService.student.delete as jest.Mock).mockResolvedValue(student);

      const resolution: Return = await studentService.deleteStudent(student.id);

      expect(resolution).toMatchObject({
        message: httpMessages_EN.student.deleteStudent.status_200,
        data: student,
      });
      expect(prismaService.student.delete).toHaveBeenCalledWith({
        where: {
          id: student.id,
        },
      });
    });

    it('should throw a NotFoundException', async () => {
      (prismaService.student.delete as jest.Mock).mockRejectedValue(error);

      await expect(studentService.deleteStudent(student.id)).rejects.toThrow(
        new NotFoundException(httpMessages_EN.student.deleteStudent.status_404),
      );
      expect(prismaService.student.delete).toHaveBeenCalledWith({
        where: {
          id: student.id,
        },
      });
    });

    it('should throw an InternalServerErrorException', async () => {
      (prismaService.student.delete as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(),
      );

      await expect(studentService.deleteStudent(student.id)).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );
      expect(prismaService.student.delete).toHaveBeenCalledWith({
        where: {
          id: student.id,
        },
      });
    });
  });
});
