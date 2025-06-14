import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';

@Controller('user')
export class UserController {
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req: ExpressRequest) {
        return {
            message: 'Rota protegida!',
            user: req.user,
        };
    }
}
