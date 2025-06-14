import { Body, Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) { }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const user = await this.auth.validateUser(body.email, body.password);
        return this.auth.login(user);
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
    async googleAuthRedirect(@Req() req: Request) {
        return req.user;
    }
}
