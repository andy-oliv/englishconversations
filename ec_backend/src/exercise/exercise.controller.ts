import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import Return from '../common/types/Return';
import CreateExerciseDTO from './dto/CreateExercise.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import validationMessages_EN from '../helper/messages/validationMessages.en';
import loggerMessages from '../helper/messages/loggerMessages';
import FetchByQueryDTO from './dto/FetchByQuery.exercise.dto';
import { RoleGuard } from '../auth/guards/role/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerMemoryStorage } from '../config/upload.config';
import FormHandlerReturn from '../common/types/FormHandlerReturn';
import updateFormHandler from '../helper/functions/updateFormHandler';
import { S3Service } from '../s3/s3.service';
import { Logger } from 'nestjs-pino';
import UpdateExerciseDTO from './dto/UpdateExercise.dto';
import parseJson from '../helper/functions/parseJson';
import FormDataHandler from '../helper/functions/formDataHandler';
import defineFileType from '../helper/functions/defineFileType';
import { AuthType } from '../common/decorators/authType.decorator';
import { UserRoles } from '@prisma/client';

@ApiTags('Exercises')
@Controller('api/exercises')
@AuthType(UserRoles.ADMIN)
@UseGuards(RoleGuard)
export class ExerciseController {
  constructor(
    private readonly exerciseService: ExerciseService,
    private readonly s3Service: S3Service,
    private readonly logger: Logger,
  ) {}

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
  @UseInterceptors(FileInterceptor('file', multerMemoryStorage))
  async createExercise(
    @UploadedFile() file: Express.Multer.File,
    @Body('metadata') metadata: string,
  ): Promise<Return> {
    if (file) {
      const exerciseData: FormHandlerReturn = await FormDataHandler(
        CreateExerciseDTO,
        file,
        metadata,
        this.s3Service,
        this.logger,
        'multimedia/exercise',
      );

      return this.exerciseService.createExercise({
        ...exerciseData.data,
        contentUrl: exerciseData.fileUrl,
      });
    }

    if (!metadata) {
      throw new BadRequestException(
        httpMessages_EN.chapter.updateChapter.status_4002,
      );
    }

    const exerciseData: any = await parseJson(CreateExerciseDTO, metadata);
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
  @UseInterceptors(FileInterceptor('file', multerMemoryStorage))
  async updateExercise(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', new ParseIntPipe()) id: number,
    @Body('metadata') metadata: string,
  ): Promise<Return> {
    if (!metadata && !file) {
      throw new BadRequestException(
        httpMessages_EN.exercise.updateExercise.status_400,
      );
    }

    if (file) {
      const exerciseData: Partial<FormHandlerReturn> = await updateFormHandler(
        this.s3Service,
        this.logger,
        'multimedia/exercise',
        UpdateExerciseDTO,
        file,
        metadata,
      );

      return this.exerciseService.updateExercise(id, {
        ...exerciseData.data,
        fileId: exerciseData.fileUrl,
      });
    }

    if (!metadata) {
      throw new BadRequestException(
        httpMessages_EN.chapter.updateChapter.status_4002,
      );
    }

    const exerciseData: any = await parseJson(UpdateExerciseDTO, metadata);
    return this.exerciseService.updateExercise(id, exerciseData);
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
