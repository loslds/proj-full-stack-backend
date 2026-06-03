 
// C:\repository\proj-full-stack-backend\src\config\systemPaths.ts
import path from 'path';

const IMAGENS_BASE = 'C:/imagens-sgv';

export const SYSTEM_PATHS = {
  // Servidor
  SERVER_ASSETS_BASE: path.resolve('src/assets'),
  SERVER_ZIP_SOURCE: path.resolve('src/assets/arq_zip'),

  SERVER_DEFAULTS: path.resolve('src/assets/defaults'),
  SERVER_DEFAULT_AVT: path.resolve('src/assets/defaults/avt'),
  SERVER_DEFAULT_BTN: path.resolve('src/assets/defaults/btn'),
  SERVER_DEFAULT_FT: path.resolve('src/assets/defaults/ft'),
  SERVER_DEFAULT_LG: path.resolve('src/assets/defaults/lg'),
  SERVER_DEFAULT_PNL: path.resolve('src/assets/defaults/pnl'),

  SERVER_USERCLIENTS: path.resolve('src/assets/userclients'),
  SERVER_USERCLIENTS_FT: path.resolve('src/assets/userclients/ft'),
  SERVER_USERCLIENTS_LG: path.resolve('src/assets/userclients/lg'),

  SERVER_TEMP_IMG: path.resolve('src/assets/img'),
  SERVER_QUARENTENA: path.resolve('src/assets/quarentena'),

  // Terminal-client / pasta pública
  IMAGENS_BASE,
  IMAGENS_ARQ_ZIP: path.join(IMAGENS_BASE, 'arq_zip'),

  IMAGENS_DEFAULTS: path.join(IMAGENS_BASE, 'defaults'),
  IMAGENS_DEFAULT_AVT: path.join(IMAGENS_BASE, 'defaults', 'avt'),
  IMAGENS_DEFAULT_BTN: path.join(IMAGENS_BASE, 'defaults', 'btn'),
  IMAGENS_DEFAULT_FT: path.join(IMAGENS_BASE, 'defaults', 'ft'),
  IMAGENS_DEFAULT_LG: path.join(IMAGENS_BASE, 'defaults', 'lg'),
  IMAGENS_DEFAULT_PNL: path.join(IMAGENS_BASE, 'defaults', 'pnl'),

  IMAGENS_USERCLIENTS: path.join(IMAGENS_BASE, 'userclients'),
  IMAGENS_USERCLIENTS_FT: path.join(IMAGENS_BASE, 'userclients', 'ft'),
  IMAGENS_USERCLIENTS_LG: path.join(IMAGENS_BASE, 'userclients', 'lg'),
};