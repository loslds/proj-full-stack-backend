//C:\repository\proj-full-stack-backend\src\use-cases\pessoa\initPessoasRoutes.ts

import { Application } from "express";
import { CidadesController } from "./cidades.controller";
import { CidadesRepository } from "./cidades.repository";
import { cidadescreateValidation, cidadesupdateValidation } from "./cidades.validation";
import { dbSource } from "../../database";
import { Router } from "express";

export async function initCidadesRoutes(app: Application) {
  // 1️⃣ Criação do repository **depois** da inicialização
  const cidadesRepo = new CidadesRepository(dbSource);

  // 2️⃣ Garantir tabela e defaults
  await cidadesRepo.createNotExistsCidades();
  await cidadesRepo.insertDefaultCidades();

  // 3️⃣ Criação do controller
  const controller = new CidadesController(cidadesRepo);

  // 4️⃣ Router
  const router = Router();

  router.post('/', cidadescreateValidation, controller.createNewCidades.bind(controller));
  router.patch('/:cidadesId', cidadesupdateValidation, controller.updateIdCidades.bind(controller));
  router.delete('/:cidadesId', controller.removeCidadesId.bind(controller));
  router.get('/', controller.findAllCidades.bind(controller));
  router.get('/id/:cidadesId', controller.getOneIdCidades.bind(controller));
  router.get('/nome', controller.findOneNomeCidades.bind(controller));
  router.get('/sigla', controller.findOneCidadesBySigla.bind(controller));
  router.get('/search', controller.searchByNomeOuEstadoPaginado.bind(controller));
  router.get('/estado', controller.findCidadesByEstado.bind(controller));

  app.use("/api/cidades", router);
}

