import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import GeneratedTokens from '../common/types/GeneratedTokens';
import { Response } from 'express';
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

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

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
      secure: true,
      sameSite: 'strict',
      maxAge: refreshCookieExpiration,
    });

    response.cookie('ec_accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: accessCookieExpiration,
    });
    return { message: httpMessages_EN.auth.login.status_200 };
  }

  @Public()
  @Post('register')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.auth.login.status_200,
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
  async register(
    @Body() userData: RegisterUserDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    const result: Return = await this.userService.registerUser(userData);
    return await this.authService.generateEmailConfirmationToken(
      result.data.id,
      result.data.name,
      result.data.email,
      result.data.role,
    );
  }

  @Public()
  @Patch('registered')
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
      secure: true,
      sameSite: 'strict',
      maxAge: refreshCookieExpiration,
    });

    response.cookie('ec_accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: accessCookieExpiration,
    });

    return { message: httpMessages_EN.auth.login.status_200 };
  }

  @Get('logout')
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
  async updatePassword(
    @Query() { token }: CheckTokenDTO,
    @Body() data: updatePasswordDTO,
  ): Promise<Return> {
    return this.authService.updatePassword(data.email, data.password, token);
  }

  @Patch('reset/email')
  async updateEmail(
    @Req() request: RequestWithUser,
    @Body() { email }: UpdateEmailDTO,
  ): Promise<Return> {
    return this.authService.updateEmail(request, email);
  }

  @Public()
  @Get('reset')
  async generateToken(
    @Body() data: GenerateResetTokenDTO,
  ): Promise<{ message: string }> {
    return this.authService.generateResetToken(data.email);
  }
}
