//C:\repository\proj-full-stack-backend\src\use-cases\pessoa\initPessoasRoutes.ts

import { Application } from "express";
import { FornecedoresController } from "./fornecedores.controller";
import { FornecedoresRepository } from "./fornecedores.repository";
import { fornecedorescreateValidation, fornecedoresupdateValidation } from "./fornecedores.validation";
import { dbSource } from "../../database";
import { Router } from "express";

export async function initFornecedoresRoutes(app: Application) {
  // 1️⃣ Criação do repository **depois** da inicialização
  const fornecedoresRepo = new FornecedoresRepository(dbSource);

  // 2️⃣ Garantir tabela e defaults
  await fornecedoresRepo.createNotExistsFornecedores();
  // await empresasRepo.insertDefaultEmpresas();

  // 3️⃣ Criação do controller
  const controller = new FornecedoresController(fornecedoresRepo);

  // 4️⃣ Router
  const router = Router();

  router.get("/", controller.findAllFornecedores.bind(controller));
  router.post('/', fornecedorescreateValidation, controller.createNewFornecedores.bind(controller));
  router.get('/:fornecedoresId', controller.getOneFornecedoresId.bind(controller));
  router.patch('/:fornecedoresId', fornecedoresupdateValidation, controller.updateIdFornecedores.bind(controller));
  router.get('/:fornecedoresId', controller.getOneFornecedoresId.bind(controller));  
  router.delete('/:pessoasId', controller.removeIdFornecedores.bind(controller));
  router.get('/by-one-name', controller.findOneFornecedoresNome.bind(controller));
  router.get('/by-one-fantasy', controller.findOneFornecedoresFantasy.bind(controller));
  router.get('/by-pessoas/:pessoasId', controller.findAllFornecedoresPessoasId.bind(controller));
  router.get('/by-imagens/:imagensId', controller.findAllFornecedoresImagensId.bind(controller));
  router.get('/search', controller.searchFornecedores.bind(controller));
  router.get('/details', controller.findAllFornecedoresByDetails.bind(controller));

  // 5️⃣ Monta na app
  app.use("/api/fornecedores", router);
}

