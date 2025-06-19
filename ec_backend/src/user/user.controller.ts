import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import validationMessages_EN from '../helper/messages/validationMessages.en';
import RegisterUserDTO from './dto/registerUser.dto';
import FetchUserByEmailDTO from './dto/fetchUserByEmail.dto';
import UpdateUserDTO from './dto/updateUser.dto';

@ApiTags('Users')
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
  async registerUser(@Body() userData: RegisterUserDTO): Promise<Return> {
    return this.userService.registerUser(userData);
  }

  @Get('query')
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
  async updateUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateUserDTO,
  ): Promise<Return> {
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
