import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as Tesseract from 'tesseract.js';
import * as fs from 'fs';
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

    async processOcr(documentId: string, userId: string) {
        const document = await this.prisma.document.findFirst({
            where: { id: documentId, userId },
        });

        if (!document) {
            throw new NotFoundException('Document not found or not owned by user');
        }

        const imagePath = document.filepath;

        const result = await Tesseract.recognize(imagePath, 'eng', {
            logger: m => console.log(`[OCR] ${m.status} - ${m.progress}`),
        });

        const text = result.data.text;

        await this.prisma.ocrResult.upsert({
            where: { documentId: document.id },
            update: { content: text },
            create: {
                documentId: document.id,
                content: text,
            },
        });

        return {
            message: 'OCR completed',
            text: text.slice(0, 200) + '...',
        };
    }      
}
