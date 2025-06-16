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
    @UseInterceptors(
        FileInterceptor('file', {
            dest: './uploads',
            limits: { fileSize: 10 * 1024 * 1024 },
            fileFilter: (req, file, cb) => {
                if (
                    file.mimetype === 'application/pdf' ||
                    file.mimetype.startsWith('image/')
                ) {
                    cb(null, true);
                } else {
                    cb(new Error('Tipo de arquivo não suportado'), false);
                }
            },
        }),
    )
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request,
    ) {
        console.log('req.user:', req.user); // veja se sub está presente

        const user = req.user as { sub: string };
        const result = await this.documentService.saveDocument(user.sub, file);
        return result;
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
  