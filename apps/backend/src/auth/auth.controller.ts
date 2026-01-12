import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  Res,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { LoginDto, RegisterDto } from './dto';
import { AUTH } from '../config/constants';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.auth.validateUser(body.email, body.password);
    const { access_token } = this.auth.login(user);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: AUTH.COOKIE_MAX_AGE_MS,
    });

    return { message: 'Login realizado com sucesso' };
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.auth.register(body);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user as { id: string; email: string };
    const { access_token } = this.auth.login(user);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: AUTH.COOKIE_MAX_AGE_MS,
    });

    const redirectUrl = process.env.FRONTEND_URL;

    if (!redirectUrl) {
      throw new Error(
        'FRONTEND_URL is not defined in the environment variables.',
      );
    }

    return res.redirect(redirectUrl);
  }

  @Get('logout')
  logout(@Res() res: Response) {
    res.clearCookie('access_token');
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Logout realizado com sucesso' });
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
