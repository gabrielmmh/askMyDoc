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
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'PaggoOCR',
            },
        });
    }

    async ask(prompt: string): Promise<string> {
        const completion = await this.openai.chat.completions.create({
            model: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
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
