
//C:\repository\proj-full-stack-backend\src\use-cases\pessoa\initPessoasRoutes.ts

import { Application } from "express";
import { ImagensController } from "./imagens.controller";
import { ImagensRepository } from "./imagens.repository";
import { imagenscreateValidation, imagensupdateValidation } from "./imagens.validation";
import { dbSource } from "../../database";
import { Router } from "express";

export async function initImagensRoutes(app: Application) {
  // 1️⃣ Criação do repository **depois** da inicialização
  const imagensRepo = new ImagensRepository(dbSource);

  // 2️⃣ Garantir tabela e defaults
  await imagensRepo.createNotExistsImagens();
  await imagensRepo.insertDefaultImagens();

  // 3️⃣ Criação do controller
  const controller = new ImagensController(imagensRepo);

  // 4️⃣ Router
  const router = Router();

  router.get("/", controller.findAll.bind(controller));
  router.get("/search", controller.search.bind(controller));
  router.get("/search-arqTipo", controller.searchArqName.bind(controller));
  router.get("/search-arqNome", controller.searchArqTipo.bind(controller));
  router.get("/one-arqNome", controller.findOneArqNome.bind(controller));
  router.get("/all-arqNome", controller.findAllArqNome.bind(controller));
  router.get("/all-arqTipo", controller.findAllArqTipo.bind(controller));
  router.get("/:imagensId", controller.getOne.bind(controller));
  router.post("/", imagenscreateValidation, controller.create.bind(controller));
  router.patch("/:imagensId", imagensupdateValidation, controller.update.bind(controller));
  router.delete("/:imagensId", controller.remove.bind(controller));

  // 5️⃣ Monta na app
  app.use("/api/imagens", router);
}
