//C:\repository\proj-full-stack-backend\src\use-cases\consumidor\initConsumidoresRoutes.ts

import { Application } from "express";
import { ConsumidoresController } from "./consumidores.controller";
import { ConsumidoresRepository } from "./consumidores.repository";
import { consumidorescreateValidation, consumidoresupdateValidation } from "./consumidores.validation";
import { dbSource } from "../../database";
import { Router } from "express";

export async function initConsumidoresRoutes(app: Application) {
  // 1️⃣ Criação do repository **depois** da inicialização
  const consumidoresRepo = new ConsumidoresRepository(dbSource);

  // 2️⃣ Garantir tabela e defaults
  await consumidoresRepo.createNotExistsConsumidores();
  // await empresasRepo.insertDefaultEmpresas();

  // 3️⃣ Criação do controller
  const controller = new ConsumidoresController(consumidoresRepo);

  // 4️⃣ Router
  const router = Router();

  router.get("/", controller.findAllConsumidores.bind(controller));
  router.post('/', consumidorescreateValidation, controller.createNewConsumidores.bind(controller));
  router.get('/:consumidoresId', controller.getOneConsumidoresId.bind(controller));
  router.patch('/:consumidoresId', consumidoresupdateValidation, controller.updateIdConsumidores.bind(controller));
  router.get('/:consumidoresId', controller.getOneConsumidoresId.bind(controller));  
  router.delete('/:consumidoresId', controller.removeIdConsumidores.bind(controller));
  router.get('/by-one-name', controller.findOneConsumidoresNome.bind(controller));
  router.get('/by-one-fantasy', controller.findOneConsumidoresFantasy.bind(controller));
  router.get('/by-pessoas/:pessoasId', controller.findAllConsumidoresPessoasId.bind(controller));
  router.get('/by-imagens/:imagensId', controller.findAllConsumidoresImagensId.bind(controller));
  router.get('/search', controller.searchByConsumidores.bind(controller));
  router.get('/details', controller.findAllConsumidoresByDetails.bind(controller));

  // 5️⃣ Monta na app
  app.use("/api/consumidores", router);
}

