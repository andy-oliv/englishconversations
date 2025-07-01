import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import validationMessages_EN from '../helper/messages/validationMessages.en';
import RegisterUserDTO from './dto/registerUser.dto';
import FetchUserByEmailDTO from './dto/fetchUserByEmail.dto';
import UpdateUserDTO from './dto/updateUser.dto';
import { RoleGuard } from '../auth/guards/role/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerMemoryStorage } from '../config/upload.config';
import FormDataHandler from '../helper/functions/formDataHandler';
import { S3Service } from '../s3/s3.service';
import { Logger } from 'nestjs-pino';
import FormHandlerReturn from '../common/types/FormHandlerReturn';
import parseJson from '../helper/functions/parseJson';
import updateFormHandler from '../helper/functions/templates/updateFormHandler';

@ApiTags('Users')
@Controller('api/users')
export class UserController {
  private readonly allowedTypes: string[];
  constructor(
    private readonly userService: UserService,
    private readonly s3Service: S3Service,
    private readonly logger: Logger,
  ) {
    this.allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'image/webp',
    ];
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Success',
    example: httpMessages_EN.user.registerUser.status_201,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example:
      validationMessages_EN.user.registerUserDTO.password.isStrongPassword,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    example: httpMessages_EN.user.validateUserAvailability.status_409,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  @UseInterceptors(FileInterceptor('file', multerMemoryStorage))
  async registerUser(
    @UploadedFile() file: Express.Multer.File,
    @Body('metadata') metadata: string,
  ): Promise<Return> {
    if (file) {
      if (!this.allowedTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          httpMessages_EN.user.registerUser.status_400,
        );
      }

      const user: FormHandlerReturn = await FormDataHandler(
        RegisterUserDTO,
        file,
        metadata,
        this.s3Service,
        this.logger,
        'images/userAvatars',
      );
      return this.userService.registerUser({
        ...user.data,
        avatarUrl: user.fileUrl,
      });
    }

    const data = await parseJson(RegisterUserDTO, metadata);
    return this.userService.registerUser(data);
  }

  @Get('query')
  @UseGuards(RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.user.fetchUserByEmail.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: validationMessages_EN.user.registerUserDTO.email.isEmail,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.user.fetchUserByEmail.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchUserByEmail(@Query() data: FetchUserByEmailDTO): Promise<Return> {
    return this.userService.fetchUserByEmail(data.email);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.user.fetchUserById.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: validationMessages_EN.user.registerUserDTO.email.isEmail,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.user.fetchUserById.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchUserById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Return> {
    return this.userService.fetchUserById(id);
  }

  @Get()
  @UseGuards(RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.user.fetchUsers.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.user.fetchUsers.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchUsers(): Promise<Return> {
    return this.userService.fetchUsers();
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.user.updateUser.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.user.updateUser.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  @UseInterceptors(FileInterceptor('file', multerMemoryStorage))
  async updateUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('metadata') metadata: string,
  ): Promise<Return> {
    if (file) {
      if (!this.allowedTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          httpMessages_EN.user.updateUser.status_400,
        );
      }

      const user: Partial<FormHandlerReturn> = await updateFormHandler(
        this.s3Service,
        this.logger,
        'images/userAvatars',
        UpdateUserDTO,
        file,
        metadata,
      );
      return this.userService.updateUser(id, {
        ...user.data,
        avatarUrl: user.fileUrl,
      });
    }

    if (!metadata) {
      throw new BadRequestException(
        httpMessages_EN.user.updateUser.status_4002,
      );
    }

    const data = await parseJson(UpdateUserDTO, metadata);
    return this.userService.updateUser(id, data);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.user.deleteUser.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.user.deleteUser.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async deleteUser(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Return> {
    return this.userService.deleteUser(id);
  }
}
