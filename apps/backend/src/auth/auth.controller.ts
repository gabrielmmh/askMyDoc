import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

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
}
