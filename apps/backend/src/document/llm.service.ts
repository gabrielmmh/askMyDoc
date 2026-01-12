import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class LlmService implements OnModuleInit {
  private readonly logger = new Logger(LlmService.name);
  private openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENROUTER_API_KEY');
    const baseUrl = this.configService.get<string>(
      'LLM_BASE_URL',
      'https://openrouter.ai/api/v1',
    );
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY environment variable is required');
    }

    this.openai = new OpenAI({
      baseURL: baseUrl,
      apiKey,
      defaultHeaders: {
        'HTTP-Referer': frontendUrl || '',
        'X-Title': 'PaggoOCR',
      },
    });
  }

  onModuleInit() {
    this.logger.log('LLM Service initialized successfully');
  }

  async ask(prompt: string): Promise<string> {
    const model = this.configService.get<string>(
      'LLM_MODEL',
      'meta-llama/llama-3.2-3b-instruct:free',
    );

    const completion = await this.openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    if (!completion.choices?.length || !completion.choices[0]?.message) {
      throw new Error('Invalid LLM response structure');
    }

    return completion.choices[0].message.content || '';
  }
}
