
// C:\repository\proj-full-stack-backend\src\use-cases\cidade\initCidadesRoutes.ts
import { AppDataSource } from '../../config/db';
import { Application, Router } from "express";
import { CidadesRepository } from "./cidades.repository";
import { CidadesController } from "./cidades.controller";
import { cidadesCreateValidation, cidadesUpdateValidation } from "./cidades.validation";

export async function initCidadesRoutes(app: Application) {
  // 1️⃣ Instancia repositório
  const repo = new CidadesRepository(AppDataSource);

  // 2️⃣ Cria tabela e insere defaults (se vazio)
  await repo.createNotExistsCidades();
  await repo.insertDefaultCidades();

  // 3️⃣ Instancia controller
  const controller = new CidadesController(repo);

  // 4️⃣ Define router
  const router = Router();

  // ==========================================================
  // CRUD PRINCIPAL
  // ==========================================================

  router.post( "/", cidadesCreateValidation, controller.createNewCidades.bind(controller) );
  router.patch( "/:cidadesId", cidadesUpdateValidation, controller.updateIdCidades.bind(controller) );
  router.delete( "/:cidadesId", controller.removeCidadesId.bind(controller) );
  router.get( "/", controller.findAllCidades.bind(controller) );

  // ==========================================================
  // CONSULTAS ESPECÍFICAS
  // ==========================================================
  router.get( "/id/:cidadesId", controller.getOneIdCidades.bind(controller) );
  router.get( "/nome", controller.findOneNomeCidades.bind(controller) );
  router.get( "/search", controller.searchByNomeOuEstadoPaginado.bind(controller) );

  // ==========================================================
  // CIDADES POR ESTADO
  // ==========================================================
  router.get( "/estado/:id_estados", controller.listAllCidadesByIdEstado.bind(controller) );

  // ==========================================================
  // LISTA DETALHADA (cidade + estado)
  // ==========================================================
  router.get( "/details", controller.listAllCidadesDetails.bind(controller) );

  // -------------------------------------------
  // 5️⃣ Registra rota raiz
  // -------------------------------------------
  app.use("/api/cidades", router);
}
