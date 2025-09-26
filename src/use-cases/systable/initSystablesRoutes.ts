
//C:\repository\proj-full-stack-backend\src\use-cases\pessoa\initPessoasRoutes.ts

import { Application } from "express";
import { SystablesController } from "./systables.controller";
import { SystablesRepository } from "./systables.repository";
import { createValidation, updateValidation } from "./systables.validation";
import { dbSource } from "../../database";
import { Router } from "express";

export async function initSystablesRoutes(app: Application) {
  // 1️⃣ Criação do repository **depois** da inicialização
  const systablesRepo = new SystablesRepository(dbSource);

  // 2️⃣ Garantir tabela e defaults
  await systablesRepo.createNotExistsSystables();
  //await systablesRepo.insertDefaultPessoas();

  // 3️⃣ Criação do controller
  const controller = new SystablesController(systablesRepo);

  // 4️⃣ Router
  const router = Router();

  router.get("/", controller.findAllSystables.bind(controller));
  router.get("/search", controller.searchSystables.bind(controller));
  router.get("/search-name", controller.searchByNameSystables.bind(controller));
  router.get("/search-chkdb", controller.searchByChkdbSystables.bind(controller));
  router.get("/search-regs", controller.searchByNumberregsSystables.bind(controller));
  router.get("/one-nome", controller.findOneNomeSystables.bind(controller));
  router.get("/all-nome", controller.findListByNomeSystables.bind(controller));
  router.get("/all-chkdb", controller.findListNomeByChkdbSystables.bind(controller));
  router.get("/all-regs", controller.findListNomeByNumberregsSystables.bind(controller));
  router.get("/:systablesId", controller.getOneSystables.bind(controller));
  router.post("/", createValidation, controller.createSystables.bind(controller));
  router.patch("/:systablesId", updateValidation, controller.updateIdSystables.bind(controller));
  router.delete("/:systablesId", controller.removeIdSystables.bind(controller));

  // 5️⃣ Monta na app
  app.use("/api/systables", router);
}
