//C:\repository\proj-full-stack-backend\src\use-cases\consumidor\initConsumidoresRoutes.ts

import { Application } from "express";
import { ClientesController } from "./clientes.controller";
import { ClientesRepository } from "./clientes.repository";
import { clientescreateValidation, clientesupdateValidation } from "./clientes.validation";
import { dbSource } from "../../database";
import { Router } from "express";

export async function initClientesRoutes(app: Application) {
  // 1️⃣ Criação do repository **depois** da inicialização
  const clientesRepo = new ClientesRepository(dbSource);

  // 2️⃣ Garantir tabela e defaults
  await clientesRepo.createNotExistsClientes();
  // await empresasRepo.insertDefaultEmpresas();

  // 3️⃣ Criação do controller
  const controller = new ClientesController(clientesRepo);

  // 4️⃣ Router
  const router = Router();

  router.get("/", controller.findAllClientes.bind(controller));
  router.post('/', clientescreateValidation, controller.createNewClientes.bind(controller));
  router.get('/:clientesId', controller.getOneClientesId.bind(controller));
  router.patch('/:clientesId', clientesupdateValidation, controller.updateIdClientes.bind(controller));
  router.get('/:clientesId', controller.getOneClientesId.bind(controller));  
  router.delete('/:clientesId', controller.removeIdClientes.bind(controller));
  router.get('/by-one-name', controller.findOneClientesNome.bind(controller));
  router.get('/by-one-fantasy', controller.findOneClientesFantasy.bind(controller));
  router.get('/by-pessoas/:pessoasId', controller.findAllClientesPessoasId.bind(controller));
  router.get('/by-imagens/:imagensId', controller.findAllClientesImagensId.bind(controller));
  router.get('/search', controller.searchByClientes.bind(controller));
  router.get('/details', controller.findAllClientesByDetails.bind(controller));

  // 5️⃣ Monta na app
  app.use("/api/clientes", router);
}

