import {
    Controller,
    Post,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Req,
    Get
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DocumentService } from './document.service';
import { Request } from 'express';
import { Express } from 'express'; // ✅ tipagem correta

@Controller('documents')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) { }

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', { dest: './uploads' }))
    async uploadDocument(
        @UploadedFile() file: Express.Multer.File, // ✅ aqui
        @Req() req: Request,
    ) {
        const userId = (req.user as any).sub;
        return this.documentService.saveDocument(userId, file);
    }

    @Get('ping')
    ping() {
        return { status: 'ok' };
    }
}
  