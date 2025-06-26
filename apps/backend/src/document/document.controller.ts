import {
    Controller,
    Post,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Req,
    Param,
    Body,
    Res,
    Get,
    Delete
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DocumentService } from './document.service';
import { Request, Express, Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

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
        console.log('req.user:', req.user);

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

    @UseGuards(JwtAuthGuard)
    @Post(':id/ask')
    async ask(
        @Param('id') id: string,
        @Req() req: Request,
        @Body('question') question: string
    ) {
        const user = req.user as { sub: string };
        return this.documentService.askQuestion(id, user.sub, question);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllDocuments(@Req() req: Request) {
        const user = req.user as any;
        return this.documentService.findAllByUser(user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/download')
    async downloadWithAnnotations(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const user = req.user as { sub: string };

        const filePath = await this.documentService.generateDownloadFile(id, user.sub);

        res.setHeader('Content-Disposition', 'attachment; filename=documento-com-anotacoes.txt');
        res.setHeader('Content-Type', 'text/plain');

        const fileStream = createReadStream(filePath);
        fileStream.pipe(res);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete (
        @Param('id') id: string,
            @Req() req: Request
    ) {
        const user = req.user as { sub: string };
        return this.documentService.deleteDocument(id, user.sub);
    }

}
  