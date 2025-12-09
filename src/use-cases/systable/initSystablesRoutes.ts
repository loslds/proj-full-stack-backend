
// C:\repository\proj-full-stack-backend\src\use-cases\systable\initSystablesRoutes.ts
import { Application, Router } from "express";
import { SystablesController } from "./systables.controller";
import { SystablesRepository } from "./systables.repository";
import { createValidation, updateValidation } from "./systables.validation";
import { dbSource } from "../../database";

export async function initSystablesRoutes(app: Application) {
  // 1️⃣ Cria repository somente após dbSource estar inicializado
  const systablesRepo = new SystablesRepository(dbSource);

  // 2️⃣ Criar tabela caso não exista e inserir defaults
  await systablesRepo.createNotExistsSystables();

  // 3️⃣ Cria o controller
  const controller = new SystablesController(systablesRepo);

  // 4️⃣ Router
  const router = Router();

  /* ----------------- ROTAS DE PESQUISA ----------------- */
  router.get("/search", controller.searchSysTables.bind(controller));
  router.get("/search-name", controller.searchSysTablesByNome.bind(controller));
  router.get("/search-chkdb", controller.searchSysTablesByChkdb.bind(controller));
  router.get("/search-regs", controller.searchSysTablesByNumberregs.bind(controller));

  /* ---------------- ROTAS DE LISTAGEM ------------------- */
  router.get("/one-nome", controller.findOneSysTablesNome.bind(controller));
  router.get("/all-nome", controller.findListSysTablesByNome.bind(controller));
  router.get("/all-chkdb", controller.findListSysTablesChkdb.bind(controller));
  router.get("/all-regs", controller.findListSysTablesNumberregs.bind(controller));

  /* -------------------- CRUD BÁSICO --------------------- */
  router.get("/", controller.findAllSysTables.bind(controller));
  router.post("/", createValidation, controller.createSysTables.bind(controller));

  /* ------------ rota paramétrica DEVE ser última -------- */
  router.get("/:systablesId", controller.getOneSysTablesId.bind(controller));
  router.patch("/:systablesId", updateValidation, controller.updateIdSysTables.bind(controller));
  router.delete("/:systablesId", controller.removeIdSysTables.bind(controller));

  // 5️⃣ Monta as rotas na aplicação
  app.use("/api/systables", router);
}
