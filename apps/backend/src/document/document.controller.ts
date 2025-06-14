import { Request } from 'express';
import { UseGuards, Get, Controller, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('documents')
export class DocumentController {
    @UseGuards(AuthGuard('jwt')) // <- usar direto aqui para isolar o problema
    @Get('me')
    getProfile(@Req() req: Request) {
        console.log('>>> REQ.USER', req.user);
        return req.user;
    }

    @Get('ping')
    ping() {
        return { status: 'ok' };
    }
}
