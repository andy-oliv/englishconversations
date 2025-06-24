import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import Return from '../common/types/Return';
import Student from '../entities/Student';
import generateMockStudent from '../helper/mocks/generateMockStudent';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('StudentController', () => {
  let studentController: StudentController;
  let studentService: StudentService;
  let student: Student;
  let studentList: Student[];
  let query: { city: string; state: string; country: string };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [
        {
          provide: StudentService,
          useValue: {
            registerStudent: jest.fn(),
            fetchStudents: jest.fn(),
            fetchStudentById: jest.fn(),
            fetchStudentsByQuery: jest.fn(),
            updateStudent: jest.fn(),
            deleteStudent: jest.fn(),
          },
        },
      ],
    }).compile();

    studentController = module.get<StudentController>(StudentController);
    studentService = module.get<StudentService>(StudentService);

    student = generateMockStudent();
    studentList = [generateMockStudent(), generateMockStudent()];
    query = {
      city: student.city,
      state: student.state,
      country: student.country,
    };
  });

  it('should be defined', () => {
    expect(studentController).toBeDefined();
  });

  describe('registerStudent()', () => {
    it('should register a student', async () => {
      (studentService.registerStudent as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.student.registerStudent.status_201,
        data: student,
      });

      const result: Return = await studentController.registerStudent(student);

      expect(result).toMatchObject({
        message: httpMessages_EN.student.registerStudent.status_201,
        data: student,
      });
      expect(studentService.registerStudent).toHaveBeenCalledWith(student);
    });

    it('should throw a ConflictException', async () => {
      (studentService.registerStudent as jest.Mock).mockRejectedValue(
        new ConflictException(
          httpMessages_EN.student.throwIfStudentExists.status_409,
        ),
      );

      await expect(studentController.registerStudent(student)).rejects.toThrow(
        new ConflictException(
          httpMessages_EN.student.throwIfStudentExists.status_409,
        ),
      );
      expect(studentService.registerStudent).toHaveBeenCalledWith(student);
    });

    it('should throw an InternalServerErrorException', async () => {
      (studentService.registerStudent as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(studentController.registerStudent(student)).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );
      expect(studentService.registerStudent).toHaveBeenCalledWith(student);
    });
  });

  describe('fetchStudentsByQuery()', () => {
    it('should fetch all students based on the query', async () => {
      (studentService.fetchStudentsByQuery as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.student.fetchStudentsByQuery.status_200,
        data: studentList,
      });

      const result: Return = await studentController.fetchStudentByQuery(query);

      expect(result).toMatchObject({
        message: httpMessages_EN.student.fetchStudentsByQuery.status_200,
        data: studentList,
      });

      expect(studentService.fetchStudentsByQuery).toHaveBeenCalledWith(
        query.city,
        query.state,
        query.country,
      );
    });

    it('should throw a NotFoundException', async () => {
      (studentService.fetchStudentsByQuery as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.student.fetchStudentsByQuery.status_404,
        ),
      );

      await expect(
        studentController.fetchStudentByQuery(query),
      ).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.student.fetchStudentsByQuery.status_404,
        ),
      );

      expect(studentService.fetchStudentsByQuery).toHaveBeenCalledWith(
        query.city,
        query.state,
        query.country,
      );
    });

    it('should throw an InternalServerErrorException', async () => {
      (studentService.fetchStudentsByQuery as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        studentController.fetchStudentByQuery(query),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(studentService.fetchStudentsByQuery).toHaveBeenCalledWith(
        query.city,
        query.state,
        query.country,
      );
    });
  });

  describe('fetchStudentById()', () => {
    it('should fetch a student', async () => {
      (studentService.fetchStudentById as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.student.fetchStudentById.status_200,
        data: student,
      });

      const result: Return = await studentController.fetchStudentById(
        student.id,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.student.fetchStudentById.status_200,
        data: student,
      });

      expect(studentService.fetchStudentById).toHaveBeenCalledWith(student.id);
    });

    it('should throw a NotFoundException', async () => {
      (studentService.fetchStudentById as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.student.fetchStudentById.status_404,
        ),
      );

      await expect(
        studentController.fetchStudentById(student.id),
      ).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.student.fetchStudentById.status_404,
        ),
      );

      expect(studentService.fetchStudentById).toHaveBeenCalledWith(student.id);
    });

    it('should throw an InternalServerErrorException', async () => {
      (studentService.fetchStudentById as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        studentController.fetchStudentById(student.id),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(studentService.fetchStudentById).toHaveBeenCalledWith(student.id);
    });
  });

  describe('fetchStudents()', () => {
    it('should fetch all students', async () => {
      (studentService.fetchStudents as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.student.fetchStudents.status_200,
        data: studentList,
      });

      const result: Return = await studentController.fetchStudents();

      expect(result).toMatchObject({
        message: httpMessages_EN.student.fetchStudents.status_200,
        data: studentList,
      });

      expect(studentService.fetchStudents).toHaveBeenCalled();
    });

    it('should throw a NotFoundException', async () => {
      (studentService.fetchStudents as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.student.fetchStudents.status_404),
      );

      await expect(studentController.fetchStudents()).rejects.toThrow(
        new NotFoundException(httpMessages_EN.student.fetchStudents.status_404),
      );

      expect(studentService.fetchStudents).toHaveBeenCalled();
    });

    it('should throw an InternalServerErrorException', async () => {
      (studentService.fetchStudents as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(studentController.fetchStudents()).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(studentService.fetchStudents).toHaveBeenCalled();
    });
  });

  describe('updateStudent()', () => {
    it('should update a student register', async () => {
      (studentService.updateStudent as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.student.updateStudent.status_200,
        data: student,
      });

      const result: Return = await studentController.updateStudent(
        student.id,
        student,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.student.updateStudent.status_200,
        data: student,
      });

      expect(studentService.updateStudent).toHaveBeenCalledWith(
        student.id,
        student,
      );
    });

    it('should throw a NotFoundException', async () => {
      (studentService.updateStudent as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.student.updateStudent.status_404),
      );

      await expect(
        studentController.updateStudent(student.id, student),
      ).rejects.toThrow(
        new NotFoundException(httpMessages_EN.student.updateStudent.status_404),
      );

      expect(studentService.updateStudent).toHaveBeenCalledWith(
        student.id,
        student,
      );
    });

    it('should throw an InternalServerErrorException', async () => {
      (studentService.updateStudent as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        studentController.updateStudent(student.id, student),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(studentService.updateStudent).toHaveBeenCalledWith(
        student.id,
        student,
      );
    });
  });

  describe('deleteStudent()', () => {
    it('should delete a student register', async () => {
      (studentService.deleteStudent as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.student.deleteStudent.status_200,
        data: student,
      });

      const result: Return = await studentController.deleteStudent(student.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.student.deleteStudent.status_200,
        data: student,
      });

      expect(studentService.deleteStudent).toHaveBeenCalledWith(student.id);
    });

    it('should throw a NotFoundException', async () => {
      (studentService.deleteStudent as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.student.deleteStudent.status_404),
      );

      await expect(studentController.deleteStudent(student.id)).rejects.toThrow(
        new NotFoundException(httpMessages_EN.student.deleteStudent.status_404),
      );

      expect(studentService.deleteStudent).toHaveBeenCalledWith(student.id);
    });

    it('should throw an InternalServerErrorException', async () => {
      (studentService.deleteStudent as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(studentController.deleteStudent(student.id)).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(studentService.deleteStudent).toHaveBeenCalledWith(student.id);
    });
  });
});
