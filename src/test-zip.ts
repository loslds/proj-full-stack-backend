// test-zip.ts
import fs from 'fs';
import path from 'path';

const zipPath = path.resolve(__dirname, 'assets/defaults/imagens.zip');

if (fs.existsSync(zipPath)) {
  console.log('✅ ZIP encontrado em:', zipPath);
} else {
  console.error('❌ ZIP NÃO encontrado em:', zipPath);
}
