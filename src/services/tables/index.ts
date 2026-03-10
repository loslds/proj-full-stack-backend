
//C:\repository\proj-full-stack-backend\src\services\tables\index.ts
import type { TableService } from './tableService.types';

import { pessoasService } from './pessoas.service';
import { estadosService } from './estados.service';
import { cidadesService } from './cidades.service';

// ==================================================
// Lista de services de tabelas do sistema
// ==================================================

export const tableServices: TableService[] = [
  pessoasService,
  estadosService,
  cidadesService,

  // próximos:  
];

// ==================================================
// MAPA DE CONSULTA RÁPIDA
// tableName -> service
// ==================================================

export const tableServiceMap = new Map<string, TableService>(
  tableServices.map(service => [service.tableName, service])
);

