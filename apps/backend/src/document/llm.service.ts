import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class LlmService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: process.env.OPENROUTER_API_KEY,
            defaultHeaders: {
                'HTTP-Referer': process.env.FRONTEND_URL,
                'X-Title': 'PaggoOCR',
            },
        });
    }

    async ask(prompt: string): Promise<string> {
        const completion = await this.openai.chat.completions.create({
            model: 'meta-llama/llama-3.2-3b-instruct:free',
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });

        return completion.choices[0].message.content || '';
    }
}
