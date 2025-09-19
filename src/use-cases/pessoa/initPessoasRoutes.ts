
//C:\repository\proj-full-stack-backend\src\use-cases\pessoa\initPessoasRoutes.ts

import { Application } from "express";
import { PessoasController } from "./pessoas.controller";
import { PessoasRepository } from "./pessoas.repository";
import { createValidation, updateValidation } from "./pessoas.validation";
import { dbSource } from "../../database";
import { Router } from "express";

export async function initPessoasRoutes(app: Application) {
  // 1️⃣ Criação do repository **depois** da inicialização
  const pessoasRepo = new PessoasRepository(dbSource);

  // 2️⃣ Garantir tabela e defaults
  await pessoasRepo.createNotExistsPessoas();
  await pessoasRepo.insertDefaultPessoas();

  // 3️⃣ Criação do controller
  const controller = new PessoasController(pessoasRepo);

  // 4️⃣ Router
  const router = Router();

  router.get("/", controller.findAll.bind(controller));
  router.get("/search", controller.search.bind(controller));
  router.get("/search-name", controller.searchByName.bind(controller));
  router.get("/search-sigla", controller.searchBySigla.bind(controller));
  router.get("/one-nome", controller.findOneNome.bind(controller));
  router.get("/all-nome", controller.findAllNome.bind(controller));
  router.get("/one-sigla", controller.findOneSigla.bind(controller));
  router.get("/all-sigla", controller.findAllSigla.bind(controller));
  router.get("/:pessoasId", controller.getOne.bind(controller));
  router.post("/", createValidation, controller.create.bind(controller));
  router.patch("/:pessoasId", updateValidation, controller.update.bind(controller));
  router.delete("/:pessoasId", controller.remove.bind(controller));

  // 5️⃣ Monta na app
  app.use("/api/pessoas", router);
}
