import * as Tesseract from 'tesseract.js';

export async function runOcrOnImage(filePath: string): Promise<string> {
    try {
        const result = await Tesseract.recognize(filePath, 'eng');
        return result.data.text.trim();
    } catch (err) {
        console.error('[runOcrOnImage] Erro ao processar imagem:', err);
        return '';
    }
}
