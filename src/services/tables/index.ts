
//C:\repository\proj-full-stack-backend\src\services\tables\index.ts
import type { TableService } from './tableService.types';

import { pessoasService } from './pessoas.service';

// ==================================================
// Lista de services de tabelas do sistema
// ==================================================

export const tableServices: TableService[] = [
  pessoasService,

  // próximos:
  // estadosService,
  // cidadesService,
];

// ==================================================
// MAPA DE CONSULTA RÁPIDA
// tableName -> service
// ==================================================

export const tableServiceMap = new Map<string, TableService>(
  tableServices.map(service => [service.tableName, service])
);

