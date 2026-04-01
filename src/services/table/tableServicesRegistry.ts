
//C:\repository\proj-full-stack-backend\src\services\table\tableServicesRegistry.ts


import { systablesService } from "./systables.service";
import { pessoasService } from "./pessoas.service";
import { estadosService } from "./estados.service";
import { cidadesService } from "./cidades.service";
import { imagensService } from "./imagens.service";
import { modulosService } from "./modulos.service";
import { cargosService } from "./cargos.service";
import { acoesService } from "./acoes.service";
import { perguntasService } from "./perguntas.service";

import type { SystemTableName } from "./tables";
import type { TableService } from "./tableService.types";

export const tableServicesRegistry: Partial<
  Record<SystemTableName, TableService>
> = {
  systables: systablesService,
  pessoas: pessoasService,
  estados: estadosService,
  cidades: cidadesService,
  imagens: imagensService,
  modulos: modulosService,
  cargos: cargosService,
  acoes: acoesService,
  perguntas: perguntasService,
};
