import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import GeneratedTokens from '../common/types/GeneratedTokens';
import { Request, Response } from 'express';
import LoginDTO from './dto/login.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import { Public } from '../common/decorators/public.decorator';
import Return from '../common/types/Return';
import { UserService } from '../user/user.service';
import RegisterUserDTO from '../user/dto/registerUser.dto';
import RequestWithUser from '../common/types/RequestWithUser';
import updatePasswordDTO from './dto/updatePassword.dto';
import UpdateEmailDTO from './dto/updateEmail.dto';
import GenerateResetTokenDTO from './dto/generateResetToken.dto';
import CheckTokenDTO from './dto/checkToken.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerMemoryStorage } from '../config/upload.config';
import FormHandlerReturn from '../common/types/FormHandlerReturn';
import FormDataHandler from '../helper/functions/formDataHandler';
import { S3Service } from '../s3/s3.service';
import { Logger } from 'nestjs-pino';
import parseJson from '../helper/functions/parseJson';
import allowedTypes from '../helper/functions/allowedTypes';
import { Throttle } from '@nestjs/throttler';
import { AuthType } from '../common/decorators/authType.decorator';
import { UserRoles } from '../../generated/prisma';
import { RoleGuard } from './guards/role/role.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly s3Service: S3Service,
    private readonly logger: Logger,
  ) {}

  @Throttle({ default: { ttl: 60000, limit: 3 } })
  @Public()
  @Post('admin/login')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.auth.adminLogin.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: httpMessages_EN.auth.adminVerification.status_400,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async adminLogin(
    @Body() loginData: LoginDTO,
    @Res({ passthrough: true }) response: Response,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    const rawIp: string = req.ip;
    const ipAddress: string = rawIp === '::1' ? '127.0.0.1' : rawIp;

    const token: string = await this.authService.adminLogin(
      loginData.email,
      loginData.password,
      ipAddress,
    );

    const accessCookieExpiration: number = 1000 * 60 * 60; //1 hour

    response.cookie('ec_admin_access', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: accessCookieExpiration,
    });
    return { message: httpMessages_EN.auth.adminLogin.status_200 };
  }

  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Public()
  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.auth.login.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: httpMessages_EN.auth.loginDataVerification.status_400,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async login(
    @Body() loginData: LoginDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    const tokens: GeneratedTokens = await this.authService.login(
      loginData.email,
      loginData.password,
    );

    const refreshCookieExpiration: number = 1000 * 60 * 60 * 24 * 30; // 30 days
    const accessCookieExpiration: number = 1000 * 60 * 30; //30 minutes

    response.cookie('ec_refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: refreshCookieExpiration,
    });

    response.cookie('ec_accessToken', tokens.accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: accessCookieExpiration,
    });
    return { message: httpMessages_EN.auth.login.status_200 };
  }

  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Public()
  @Post('register')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.auth.generateEmailConfirmationToken.status_200,
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
  async register(
    @UploadedFile() file: Express.Multer.File,
    @Body('metadata') metadata: string,
  ): Promise<{ message: string }> {
    if (file) {
      allowedTypes(file);

      const userData: FormHandlerReturn = await FormDataHandler(
        RegisterUserDTO,
        file,
        metadata,
        this.s3Service,
        this.logger,
        'images/userAvatars',
      );

      const result: Return = await this.userService.registerUser({
        ...userData.data,
        avatarUrl: userData.fileUrl,
      });
      return await this.authService.generateEmailConfirmationToken(
        result.data.id,
        result.data.name,
        result.data.email,
        result.data.avatarUrl,
        result.data.role,
      );
    }

    const data = await parseJson(RegisterUserDTO, metadata);
    const result: Return = await this.userService.registerUser(data);
    return await this.authService.generateEmailConfirmationToken(
      result.data.id,
      result.data.name,
      result.data.email,
      result.data.avatarUrl,
      result.data.role,
    );
  }

  @Public()
  @Patch('registered')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.auth.login.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: httpMessages_EN.auth.emailConfirmed.status_400,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async emailConfirmed(
    @Query() { token }: CheckTokenDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    const tokens: GeneratedTokens =
      await this.authService.emailConfirmed(token);

    const refreshCookieExpiration: number = 1000 * 60 * 60 * 24 * 30; // 30 days
    const accessCookieExpiration: number = 1000 * 60 * 30; //30 minutes

    response.cookie('ec_refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: refreshCookieExpiration,
    });

    response.cookie('ec_accessToken', tokens.accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: accessCookieExpiration,
    });

    return { message: httpMessages_EN.auth.login.status_200 };
  }

  @Get('logout')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.auth.logout.status_200,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async logout(@Res({ passthrough: true }) response: Response): Promise<{
    message: string;
  }> {
    return this.authService.logout(response);
  }

  @Public()
  @Patch('reset/password')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.auth.updatePassword.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: httpMessages_EN.auth.updatePassword.status_400,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async updatePassword(
    @Query('token') { token }: CheckTokenDTO,
    @Body() data: updatePasswordDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Return> {
    return this.authService.updatePassword(
      data.email,
      data.password,
      token,
      response,
    );
  }

  @AuthType(UserRoles.ADMIN, UserRoles.STUDENT)
  @Patch('reset/email')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.auth.updateEmail.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: httpMessages_EN.auth.updateEmail.status_400,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async updateEmail(
    @Req() request: RequestWithUser,
    @Query('token') token: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Return> {
    return this.authService.updateEmail(request.user.email, token, response);
  }

  @AuthType(UserRoles.ADMIN, UserRoles.STUDENT)
  @Get('reset/email')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.auth.generateEmailResetToken.status_200,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async generateEmailResetToken(
    @Req() request: RequestWithUser,
    @Body() { email }: GenerateResetTokenDTO,
  ): Promise<{ message: string }> {
    return this.authService.generateEmailResetToken(request.user.email, email);
  }

  @Public()
  @Get('reset/password')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.auth.generatePasswordResetToken.status_200,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async generatePasswordResetToken(
    @Body() data: GenerateResetTokenDTO,
  ): Promise<{ message: string }> {
    return this.authService.generatePasswordResetToken(data.email);
  }

  @Get('student-session')
  @AuthType(UserRoles.STUDENT)
  async checkStudentSession(@Req() req: RequestWithUser): Promise<Return> {
    return { message: 'user is logged', data: req.user };
  }

  @Get('admin-session')
  @AuthType(UserRoles.ADMIN)
  @UseGuards(RoleGuard)
  async checkAdminSession(@Req() req: RequestWithUser): Promise<Return> {
    return { message: 'admin is logged', data: req.user };
  }
}
