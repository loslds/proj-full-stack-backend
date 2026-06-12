
//C:\repository\proj-full-stack-backend\src\services\table\tableServicesRegistry.ts

import { systablesService } from "./systables.service";

import { pessoasService } from "./pessoas.service";
import { estadosService } from "./estados.service";
import { cidadesService } from "./cidades.service";
import { imagensService } from "./imagens.service";

import { empresasService } from "./empresas.service";
import { visitantesService } from "./visitantes.service";
import { visitasService } from "./visitas.service";
import { consumidoresService } from "./consumidores.service";
import { clientesService } from "./clientes.service";
import { fornecedoresService } from "./fornecedores.service";
import { funcionariosService } from "./funcionarios.service";

import { cadastrosService } from "./cadastros.service";
import { emailsService } from "./emails.service";
import { docsService } from "./docs.service";
import { fonesService } from "./fones.service";

import { modulosService } from "./modulos.service";
import { cargosService } from "./cargos.service";
import { acoesService } from "./acoes.service";
import { perguntasService } from "./perguntas.service";

import { usersService } from "./users.service";
import { loginsService } from "./logins.service";
import { acessosService } from "./acessos.service";
import { chavesService } from "./chaves.service";
import { pergsrespsService } from "./pergsresps.service";

import type { SystemTableName } from "./tables";
import type { TableService } from "./tableService.types";

export const tableServicesRegistry: Partial<
  Record<SystemTableName, TableService>
> = {
  systables: systablesService,

  pessoas: pessoasService,
  estados: estadosService,
  cidades: cidadesService,
  //imagens: imagensService,

  empresas: empresasService,
  visitantes: visitantesService,
  visitas: visitasService,
  consumidores: consumidoresService,
  clientes: clientesService,
  fornecedores: fornecedoresService,
  funcionarios: funcionariosService,

  cadastros: cadastrosService,
  emails: emailsService,
  docs: docsService,
  fones: fonesService,

  modulos: modulosService,
  cargos: cargosService,
  acoes: acoesService,
  perguntas: perguntasService,

  users: usersService,
  logins: loginsService,
  acessos: acessosService,
  chaves: chavesService,
  pergsresps: pergsrespsService,

  imagens: imagensService,
};

