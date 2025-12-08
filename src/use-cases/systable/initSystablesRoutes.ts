
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

  router.get("/", controller.findAllSysTables.bind(controller));
  router.get("/search", controller.searchSysTables.bind(controller));
  router.get("/search-name", controller.searchSysTablesByNome.bind(controller));
  router.get("/search-chkdb", controller.searchSysTablesByChkdb.bind(controller));
  router.get("/search-regs", controller.searchSysTablesByNumberregs.bind(controller));
  router.get("/one-nome", controller.findOneSysTablesNome.bind(controller));
  router.get("/all-nome", controller.findListSysTablesByNome.bind(controller));
  router.get("/all-chkdb", controller.findListSysTablesChkdb.bind(controller));
  router.get("/all-regs", controller.findListSysTablesNumberregs.bind(controller));
  router.get("/:systablesId", controller.getOneSysTablesId.bind(controller));
  router.post("/", createValidation, controller.createSysTables.bind(controller));
  router.patch("/:systablesId", updateValidation, controller.updateIdSysTables.bind(controller));
  router.delete("/:systablesId", controller.removeIdSysTables.bind(controller));

  // 5️⃣ Monta na app
  app.use("/api/systables", router);
}

