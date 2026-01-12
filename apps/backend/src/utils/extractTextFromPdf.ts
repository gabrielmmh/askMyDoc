import * as fs from 'fs/promises';
import * as pdfParse from 'pdf-parse';

export async function extractTextFromPdf(
  filePath: string,
): Promise<string | null> {
  try {
    const buffer = await fs.readFile(filePath);
    const data = await pdfParse(buffer);
    const extracted = data.text?.trim();

    return extracted && extracted.length > 50 ? extracted : null;
  } catch (err) {
    console.error('[extractTextFromPdf] Erro ao extrair texto:', err);
    return null;
  }
}
