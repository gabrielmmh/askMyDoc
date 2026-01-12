export default () => ({
    upload: {
        dest: process.env.UPLOAD_DIR || './uploads',
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB default
    },
    jwt: {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },
    cookie: {
        maxAge: parseInt(process.env.COOKIE_MAX_AGE || '604800000', 10), // 7 days default
    },
    llm: {
        model: process.env.LLM_MODEL || 'meta-llama/llama-3.2-3b-instruct:free',
        baseUrl: process.env.LLM_BASE_URL || 'https://openrouter.ai/api/v1',
    },
    ocrTextMinLength: parseInt(process.env.OCR_TEXT_MIN_LENGTH || '50', 10),
});
