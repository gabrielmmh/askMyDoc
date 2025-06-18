import { exec } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as Tesseract from 'tesseract.js';

function execShellCommand(cmd: string): Promise<void> {
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                console.error(`[runOcrOnPdf] Erro ao executar comando: ${cmd}\n${stderr}`);
                return reject(err);
            }
            resolve();
        });
    });
}

export async function runOcrOnPdf(filePath: string): Promise<string> {
    const outputBase = filePath.replace(/\.pdf$/, '');
    const outputImageBase = `${outputBase}_page`;

    // Converte o PDF em PNGs usando pdftoppm
    console.log("antes do comando");
    await execShellCommand(`pdftoppm -png "${filePath}" "${outputImageBase}"`);
    console.log("depois do comando");

    const dir = path.dirname(filePath);
    const baseName = path.basename(outputImageBase);

    const files = await fs.readdir(dir);
    const images = files
        .filter((f) => f.startsWith(baseName) && f.endsWith('.png'))
        .sort() // garante ordem correta das páginas
        .map((f) => path.join(dir, f));

    if (images.length === 0) {
        console.warn('[runOcrOnPdf] Nenhuma imagem gerada pelo pdftoppm');
        return '';
    }

    let fullText = '';

    for (const img of images) {
        try {
            const result = await Tesseract.recognize(img, 'eng');
            fullText += result.data.text + '\n';
        } catch (err) {
            console.error(`[runOcrOnPdf] Falha no OCR da imagem ${img}`, err);
        }

        // Limpeza
        await fs.unlink(img).catch(() => { });
    }

    return fullText.trim();
}
