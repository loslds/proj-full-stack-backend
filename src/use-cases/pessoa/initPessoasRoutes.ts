
//C:\repository\proj-full-stack-backend\src\use-cases\pessoa\initPessoasRoutes.ts

import { Application } from "express";
import { PessoasController } from "./pessoas.controller";
import { PessoasRepository } from "./pessoas.repository";
import { pessoascreateValidation, pessoasupdateValidation } from "./pessoas.validation";
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

  router.get("/", controller.findAllPessoas.bind(controller));
  router.post('/', pessoascreateValidation, controller.createNewPessoas.bind(controller));
  router.get('/:pessoasId', controller.getOnePessoasId.bind(controller));
  router.patch('/:pessoasId', pessoasupdateValidation, controller.updateIdPessoas.bind(controller));
  router.delete('/:pessoasId', controller.removeIdPessoas.bind(controller));
  router.get("/search", controller.searchPessoasAll.bind(controller));
  router.get("/search-name", controller.searchPessoasName.bind(controller));
  router.get("/search-sigla", controller.searchPessoasSigla.bind(controller));
  router.get("/one-nome", controller.findOnePessoasNome.bind(controller));
  router.get("/all-nome", controller.findAllPessoas.bind(controller));
  router.get("/one-sigla", controller.findOnePessoasSigla.bind(controller));
  router.get("/all-sigla", controller.findAllPessoasSigla.bind(controller));

  // 5️⃣ Monta na app
  app.use("/api/pessoas", router);
}

