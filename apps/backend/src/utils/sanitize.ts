export function cleanOcrText(input: string): string {
  const nullChar = String.fromCharCode(0);
  return input.split(nullChar).join('').trim();
}
