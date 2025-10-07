//C:\repository\proj-full-stack-backend\src\use-cases\funcionario\initFuncionariosRoutes.ts

import { Application } from "express";
import { FuncionariosController } from "./funcionarios.controller";
import { FuncionariosRepository } from "./funcionarios.repository";
import { funcionarioscreateValidation, funcionariosupdateValidation } from "./funcionarios.validation";
import { dbSource } from "../../database";
import { Router } from "express";

export async function initFuncionariosRoutes(app: Application) {
  // 1️⃣ Criação do repository **depois** da inicialização
  const funcionariosRepo = new FuncionariosRepository(dbSource);

  // 2️⃣ Garantir tabela e defaults
  await funcionariosRepo.createNotExistsFuncionarios();
  // await empresasRepo.insertDefaultEmpresas();

  // 3️⃣ Criação do controller
  const controller = new FuncionariosController(funcionariosRepo);

  // 4️⃣ Router
  const router = Router();

  router.get("/", controller.findAllFuncionarios.bind(controller));
  router.post('/', funcionarioscreateValidation, controller.createNewFuncionarios.bind(controller));
  router.get('/:funcionariosId', controller.getOneFuncionariosId.bind(controller));
  router.patch('/:funcionariosId', funcionariosupdateValidation, controller.updateIdFuncionarios.bind(controller));
  router.get('/:funcionariosId', controller.getOneFuncionariosId.bind(controller));  
  router.delete('/:funcionariosId', controller.removeIdFuncionarios.bind(controller));
  router.get('/by-one-name', controller.findOneFuncionariosNome.bind(controller));
  router.get('/by-one-fantasy', controller.findOneFuncionariosFantasy.bind(controller));
  router.get('/by-pessoas/:pessoasId', controller.findAllFuncionariosPessoasId.bind(controller));
  router.get('/by-imagens/:imagensId', controller.findAllFuncionariosImagensId.bind(controller));
  router.get('/search', controller.searchByFuncionarios.bind(controller));
  router.get('/details', controller.findAllFuncionariosByDetails.bind(controller));

  // 5️⃣ Monta na app
  app.use("/api/funcionarios", router);
}

