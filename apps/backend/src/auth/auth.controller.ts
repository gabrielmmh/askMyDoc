import { Body, Controller, Post, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) { }

    @Post('login')
    async login(
        @Body() body: { email: string; password: string },
        @Res({ passthrough: true }) res: Response
    ) {
        const user = await this.auth.validateUser(body.email, body.password);
        const { access_token } = await this.auth.login(user);

        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
        });

        return { message: 'Login realizado com sucesso' };
    }

    @Post('register')
    async register(@Body() body: { name: string; email: string; password: string }) {
        return this.auth.register(body);
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    googleAuth() {
        // redireciona automaticamente para o Google
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
        const { access_token } = await this.auth.login(req.user);

        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
        });

        const redirectUrl = process.env.FRONTEND_URL;

        if (!redirectUrl) {
            throw new Error('FRONTEND_URL is not defined in the environment variables.');
        }

        return res.redirect(redirectUrl);
    }

    @Get('logout')
    logout(@Res() res: Response) {
        res.clearCookie('access_token');
        return res.status(200).json({ message: 'Logout realizado com sucesso' });
    }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    getProfile(@Req() req: Request) {
        return req.user;
    }
}
