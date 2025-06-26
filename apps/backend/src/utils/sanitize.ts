export function cleanOcrText(input: string): string {
    return input.replace(/\u0000/g, '').trim();
}