import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as Tesseract from 'tesseract.js';
import * as fs from 'fs/promises';
import { Express } from 'express';
import { LlmService } from './llm.service';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fsSync from 'fs';

@Injectable()
export class DocumentService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly llmService: LlmService,
    ) { }

    async saveDocument(userId: string, file: Express.Multer.File) {
        const document = await this.prisma.document.create({
            data: {
                userId,
                filename: file.originalname,
                filepath: file.path,
            },
        });

        console.log(`[UPLOAD] Documento "${file.originalname}" salvo com sucesso.`);

        return {
            message: 'Upload realizado com sucesso',
            documentId: document.id,
        };
    }

    async processOcr(documentId: string, userId: string) {
        const document = await this.prisma.document.findFirst({
            where: { id: documentId, userId },
        });

        if (!document) {
            throw new NotFoundException('Documento não encontrado ou não pertence ao usuário');
        }

        const imagePath = document.filepath;

        console.log(`[OCR] Iniciando reconhecimento de texto para: ${imagePath}`);

        const result = await Tesseract.recognize(imagePath, 'eng', {
            logger: m => console.log(`[OCR] ${m.status} - ${Math.round(m.progress * 100)}%`),
        });

        const text = result.data.text;

        console.log(`[OCR] Texto extraído com sucesso.`);

        await this.prisma.ocrResult.upsert({
            where: { documentId: document.id },
            update: { content: text },
            create: {
                documentId: document.id,
                content: text,
            },
        });

        try {
            await fs.unlink(imagePath);
            console.log(`[OCR] Arquivo temporário removido: ${imagePath}`);
        } catch (err) {
            console.error(`[OCR] Erro ao remover o arquivo ${imagePath}:`, err);
        }

        return {
            message: 'OCR concluído com sucesso',
            text,
        };
    }

    async askQuestion(documentId: string, userId: string, question: string) {
        const doc = await this.prisma.document.findFirst({
            where: { id: documentId, userId },
            include: { ocrResult: true },
        });

        if (!doc?.ocrResult) {
            throw new NotFoundException('Documento não encontrado ou sem resultado de OCR');
        }

        console.log(`[LLM] Realizando pergunta sobre o documento: "${question}"`);

        const context = doc.ocrResult.content;

        const prompt = `Texto extraído do documento:\n\n"${context}"\n\nPergunta do usuário: ${question}`;

        const response = await this.llmService.ask(prompt);

        console.log(`[LLM] Resposta gerada com sucesso.`);

        await this.prisma.interaction.create({
            data: {
                documentId,
                question,
                answer: response,
            },
        });

        return { answer: response };
    }

    async findAllByUser(userId: string) {
        return this.prisma.document.findMany({
            where: { userId },
            include: {
                ocrResult: true,
                interactions: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });          
    }      
    
    async generateDownloadFile(documentId: string, userId: string): Promise < string > {
        const tmpDir = path.join(__dirname, '../../tmp');
        
        if (!fsSync.existsSync(tmpDir)) {
            fsSync.mkdirSync(tmpDir, { recursive: true });
        }

        const document = await this.prisma.document.findUnique({
            where: { id: documentId },
            include: {
                ocrResult: true,
                interactions: true,
            },
        });

        if(!document || document.userId !== userId) {
        throw new Error('Documento não encontrado ou acesso negado');
    }

    const content = [];

    content.push('=== Texto extraído ===\n');
    content.push(document.ocrResult?.content || 'Nenhum OCR disponível.');
    content.push('\n\n=== Interações ===\n');

    for (const interaction of document.interactions) {
        content.push(`P: ${interaction.question}`);
        content.push(`R: ${interaction.answer}\n`);
    }

    const finalText = content.join('\n');

    const filename = `document_${uuidv4()}.txt`;
    const filePath = join(__dirname, '../../tmp', filename);

    writeFileSync(filePath, finalText);
    return filePath;
    }
}
