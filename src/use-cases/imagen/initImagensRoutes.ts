
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

  router.get("/", controller.findAllImagens.bind(controller));
  router.post("/", imagenscreateValidation, controller.createNewImagens.bind(controller));
  router.get("/:imagensId", controller.getOneImagensId.bind(controller));
  router.patch("/:imagensId", imagensupdateValidation, controller.updateIdImagens.bind(controller));
  router.delete("/:imagensId", controller.removeIdImagens.bind(controller));
  router.get("/search", controller.searchImagens.bind(controller));
  router.get("/search-arqNome", controller.searchImagensArqTipo.bind(controller));
  router.get("/search-arqTipo", controller.searchImagensArqName.bind(controller));
  router.get("/one-arqNome", controller.findOneImagensArqNome.bind(controller));
  router.get("/all-arqTipo", controller.findAllImagensArqTipo.bind(controller));
  router.get("/all-arqNome", controller.findAllImagensArqNome.bind(controller));

  // 5️⃣ Monta na app
  app.use("/api/imagens", router);
}
