import { ZodValidationPipe } from '@/zod-validation-pipe/zod-validation-pipe.pipe';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthInterface } from '@shared/auth/auth.api';
import { AuthenticatedRequest } from '@shared/auth/auth.type';
import { signInSchema } from '@shared/auth/dto/signInDto';
import { Request as ExpressRequest, Response } from 'express';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController implements AuthInterface {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(new ZodValidationPipe(signInSchema))
  async signIn(
    @Body() signInDto: Parameters<AuthInterface['signIn']>[0],
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refresh_token, access_token } = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );
    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return { access_token };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const oldRefreshToken = req.cookies['refreshToken'];
    if (typeof oldRefreshToken !== 'string') {
      throw new UnauthorizedException('Refresh token required');
    }

    // Validate old refresh token, if invalid, throw an error.
    const { refresh_token, access_token } =
      await this.authService.refresh(oldRefreshToken);

    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return { access_token };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: AuthenticatedRequest) {
    return this.authService.getProfile(req.user.username);
  }

  //@Public()
  //@HttpCode(HttpStatus.OK)
  //@Post('create-user')
  //createUser(@Body() signInDto: SignInDto) {
  //  return this.authService.createUser(signInDto.username, signInDto.password);
  //}

  //@Public()
  //@HttpCode(HttpStatus.OK)
  //@Get('generate-app-key')
  //generateAppKey() {
  //  return this.authService.generateAppKey();
  //}
}
