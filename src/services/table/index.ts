
//C:\repository\proj-full-stack-backend\src\services\tables\index.ts
import type { TableService } from './tableService.types';

import { pessoasService } from './pessoas.service';
import { estadosService } from './estados.service';
import { cidadesService } from './cidades.service';
import { imagensService } from "./imagens.service";
import { modulosService } from "./modulos.service";
import { cargosService } from './cargos.service';
import { acoesService } from './acoes.service';
import { perguntasService } from './perguntas.service';

import { empresasService } from './empresas.service';
import { visitantesService } from './visitantes.service';
import { visitasService } from './visitas.service';
import { consumidoresService } from './consumidores.service';
import { clientesService } from './clientes.service';
import { fornecedoresService } from './fornecedores.service';
import { funcionariosService } from './funcionarios.service';
import { cadastrosService } from './cadastros.service';


// ==================================================
// Lista de services de tabelas do sistema
// ==================================================

export const tableServices: TableService[] = [
  pessoasService,
  estadosService,
  cidadesService,
  imagensService,
  modulosService,
  cargosService,
  acoesService,
  perguntasService,
  empresasService, 
  visitantesService,      
  visitasService,
  consumidoresService,    
  clientesService,        
  fornecedoresService,    
  funcionariosService,    
  cadastrosService,


  // próximos:  
];

// ==================================================
// MAPA DE CONSULTA RÁPIDA
// tableName -> service
// ==================================================

export const tableServiceMap = new Map<string, TableService>(
  tableServices.map(service => [service.tableName, service])
);

