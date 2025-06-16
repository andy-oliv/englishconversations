import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import Return from '../common/types/Return';
import CreateExerciseDTO from './dto/CreateExercise.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import validationMessages_EN from '../helper/messages/validationMessages.en';
import loggerMessages from '../helper/messages/loggerMessages';
import FetchByQueryDTO from './dto/FetchByQuery.exercise.dto';
import { id_ID } from '@faker-js/faker/.';
import UpdateExerciseDTO from './dto/UpdateExercise.dto';

@ApiTags('Exercises')
@Controller('api/exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Success',
    example: httpMessages_EN.exercise.createExercise.status_201,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: validationMessages_EN.exercises.createExerciseDTO.type.isNotEmpty,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    example: loggerMessages.exercise.throwIfExerciseExists.status_409,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async createExercise(
    @Body() exerciseData: CreateExerciseDTO,
  ): Promise<Return> {
    return this.exerciseService.createExercise(exerciseData);
  }

  @Get('query')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.exercise.fetchExercisesByQuery.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.exercise.fetchExercisesByQuery.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  fetchExercisesByQuery(@Query() query: FetchByQueryDTO): Promise<Return> {
    return this.exerciseService.fetchExercisesByQuery(
      query.level,
      query.difficulty,
      query.quizId,
    );
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.exercise.fetchExerciseById.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (numeric string is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.exercise.fetchExerciseById.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  fetchExerciseById(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<Return> {
    return this.exerciseService.fetchExerciseById(id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.exercise.fetchExercises.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.exercise.fetchExercises.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchExercises(): Promise<Return> {
    return this.exerciseService.fetchExercises();
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.exercise.updateExercise.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (numeric string is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.exercise.updateExercise.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async updateExercise(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updatedData: UpdateExerciseDTO,
  ): Promise<Return> {
    return this.exerciseService.updateExercise(id, updatedData);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.exercise.deleteExercise.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (numeric string is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.exercise.deleteExercise.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async deleteExercise(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<Return> {
    return this.exerciseService.deleteExercise(id);
  }
}
