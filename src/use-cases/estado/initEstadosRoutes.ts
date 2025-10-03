
//C:\repository\proj-full-stack-backend\src\use-cases\estado\initEstadosRoutes.ts

import { Application } from "express";
import { EstadosRepository } from "./estados.repository";
import { EstadosController } from "./estados.controller";
import { estadoscreateValidation, estadosupdateValidation } from "./estados.validation";
import { dbSource } from "../../database";
import { Router } from "express";

export async function initEstadosRoutes(app: Application) {
  // 1️⃣ Criação do repository **depois** da inicialização
  const estadosRepo = new EstadosRepository(dbSource);

  // 2️⃣ Garantir tabela e defaults
  await estadosRepo.createNotExistsEstados();
  await estadosRepo.insertDefaultEstados();

  // 3️⃣ Criação do controller
  const controller = new EstadosController(estadosRepo);

  // 4️⃣ Router
  const router = Router();

  router.get("/", controller.findAllEstados.bind(controller));
  router.post('/', estadoscreateValidation, controller.createNewEstados.bind(controller));
  router.get('/:estadosId', controller.getOneEstadosId.bind(controller));
  router.patch('/:estadosId', estadosupdateValidation, controller.updateIdEstados.bind(controller));
  router.delete('/:estadosId', controller.removeIdEstados.bind(controller));
  router.get("/search", controller.searchEstadosAll.bind(controller));
  router.get("/search-name", controller.searchEstadosName.bind(controller));
  router.get("/search-uf", controller.searchEstadosUf.bind(controller));
  router.get("/one-nome", controller.findOneEstadosNome.bind(controller));
  router.get("/all-nome", controller.findAllEstados.bind(controller));
  router.get("/one-uf", controller.findOneEstadosUf.bind(controller));
  router.get("/all-uf", controller.findAllEstadosUf.bind(controller));

  // 5️⃣ Monta na app
  app.use("/api/estados", router);
}

