import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Express } from 'express';

@Injectable()
export class DocumentService {
    constructor(private readonly prisma: PrismaService) { }

    async saveDocument(userId: string, file: Express.Multer.File) {
        const document = await this.prisma.document.create({
            data: {
                userId,
                filename: file.originalname,
                filepath: file.path,
            },
        });

        return {
            message: 'Upload successful',
            documentId: document.id,
        };
    }
}
