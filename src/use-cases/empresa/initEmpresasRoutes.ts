//C:\repository\proj-full-stack-backend\src\use-cases\pessoa\initPessoasRoutes.ts

import { Application } from "express";
import { EmpresasController } from "./empresas.controller";
import { EmpresasRepository } from "./empresas.repository";
import { empresascreateValidation, empresasupdateValidation } from "./empresas.validation";
import { dbSource } from "../../database";
import { Router } from "express";

export async function initEmpresasRoutes(app: Application) {
  // 1️⃣ Criação do repository **depois** da inicialização
  const empresasRepo = new EmpresasRepository(dbSource);

  // 2️⃣ Garantir tabela e defaults
  await empresasRepo.createNotExistsEmpresas();
  // await empresasRepo.insertDefaultEmpresas();

  // 3️⃣ Criação do controller
  const controller = new EmpresasController(empresasRepo);

  // 4️⃣ Router
  const router = Router();

  router.get("/", controller.findAllEmpresas.bind(controller));
  router.post('/', empresascreateValidation, controller.createNewEmpresas.bind(controller));
  router.get('/:empresasId', controller.getOneEmpresasId.bind(controller));
  router.patch('/:empresasId', empresasupdateValidation, controller.updateIdEmpresas.bind(controller));
  router.get('/:empresasId', controller.getOneEmpresasId.bind(controller));  
  router.delete('/:pessoasId', controller.removeIdEmpresas.bind(controller));
  router.get('/by-one-name', controller.findOneEmpresasNome.bind(controller));
  router.get('/by-one-fantasy', controller.findOneEmpresasFantasy.bind(controller));
  router.get('/by-pessoas/:pessoasId', controller.findAllEmpresasPessoasId.bind(controller));
  router.get('/by-imagens/:imagensId', controller.findAllEmpresasImagensId.bind(controller));
  router.get('/search', controller.searchByEmpresas.bind(controller));
  router.get('/details', controller.findAllEmpresasByDetails.bind(controller));

  // 5️⃣ Monta na app
  app.use("/api/empresas", router);
}

