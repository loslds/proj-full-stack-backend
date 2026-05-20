
// C:\repository\proj-full-stack-backend\src\config\systemPaths.ts

import path from 'path';

const IMAGENS_BASE = 'C:/imagens-sgv';

export const SYSTEM_PATHS = {
  // ZIPs recebidos pelo backend para seed/importação
  ZIP_SOURCE: path.resolve('src/assets/arq_zip'),

  // Base pública servida pelo Express em /assets
  IMAGENS_BASE,

  // Diretórios principais
  
  IMAGENS_DEFAULTS: path.join(IMAGENS_BASE, 'defaults'),
  IMAGENS_USERCLIENTS: path.join(IMAGENS_BASE, 'userclients'),

  // Defaults do sistema
  IMAGENS_DEFAULT_AVT: path.join(IMAGENS_BASE, 'defaults', 'avt'),
  IMAGENS_DEFAULT_BTN: path.join(IMAGENS_BASE, 'defaults', 'btn'),
  IMAGENS_DEFAULT_LG: path.join(IMAGENS_BASE, 'defaults', 'lg'),
  IMAGENS_DEFAULT_PNL: path.join(IMAGENS_BASE, 'defaults', 'pnl'),
  IMAGENS_DEFAULT_FT: path.join(IMAGENS_BASE, 'defaults', 'ft'),
  // Imagens dos clientes/usuários
  IMAGENS_USERCLIENTS_FT: path.join(IMAGENS_BASE, 'userclients', 'ft'),
  IMAGENS_USERCLIENTS_LG: path.join(IMAGENS_BASE, 'userclients', 'lg'),
  // Imagens de  arquivos regeitados por qualquer motivo
  IMAGENS_REJEITADAS_IMG: path.join(IMAGENS_BASE, 'quarentena'),
};


