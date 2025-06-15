import {
    Controller,
    Post,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Req,
    Param,
    Get
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DocumentService } from './document.service';
import { Request } from 'express';
import { Express } from 'express';

@Controller('documents')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) { }

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', { dest: './uploads' }))
    async uploadDocument(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request,
    ) {
        const userId = (req.user as any).sub;
        return this.documentService.saveDocument(userId, file);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/ocr')
    async runOcr(@Param('id') documentId: string, @Req() req: Request) {
        const user = req.user as { sub: string; email: string };
        return this.documentService.processOcr(documentId, user.sub);
    }

    @Get('ping')
    ping() {
        return { status: 'ok' };
    }
}
  