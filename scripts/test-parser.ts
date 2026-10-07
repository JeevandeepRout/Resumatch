import fs from 'fs';
import { extractTextFromFile } from '../src/lib/parsers';

async function main() {
  const buffer = fs.readFileSync('dummy.pdf');
  try {
    const text = await extractTextFromFile(buffer, 'application/pdf');
    console.log('Extracted text from PDF:');
    console.log('--- START ---');
    console.log(text.trim());
    console.log('--- END ---');
  } catch (error) {
    console.error('Error extracting text:', error);
  }
}

main();
