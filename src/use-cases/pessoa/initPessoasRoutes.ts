
// C:\repository\proj-full-stack-backend\src\use-cases\pessoa\initPessoasRoutes.ts
import { Application, Router } from "express";
import { PessoasController } from "./pessoas.controller";
import { PessoasRepository } from "./pessoas.repository";
import { pessoascreateValidation, pessoasupdateValidation } from "./pessoas.validation";
import { AppDataSource } from "../../config/db";

export async function initPessoasRoutes(app: Application) {
  // 1️⃣ Repository somente após o DataSource estar inicializado
  const pessoasRepo = new PessoasRepository(AppDataSource);

  // 2️⃣ Garantir existência da tabela e dados padrão
  await pessoasRepo.createNotExistsPessoas();
  await pessoasRepo.insertDefaultPessoas();

  // 3️⃣ Controller
  const controller = new PessoasController(pessoasRepo);

  // 4️⃣ Router
  const router = Router();

  // ======================= ROTAS FIXAS =======================
  router.get("/", controller.findAllPessoas.bind(controller));
  router.post("/", pessoascreateValidation, controller.createNewPessoas.bind(controller));

  router.get("/search", controller.searchPessoasAll.bind(controller));
  router.get("/search-name", controller.searchPessoasNome.bind(controller));
  router.get("/search-sigla", controller.searchPessoasSigla.bind(controller));

  router.get("/one-nome", controller.findOnePessoasNome.bind(controller));
  router.get("/all-nome", controller.findAllPessoasNome.bind(controller));

  router.get("/one-sigla", controller.findOnePessoasSigla.bind(controller));
  router.get("/all-sigla", controller.findAllPessoasSigla.bind(controller));

  // ======================= ROTAS DINÂMICAS =======================
  router.get("/:pessoasId", controller.getOnePessoasId.bind(controller));

  router.patch(
    "/:pessoasId",
    pessoasupdateValidation,
    controller.updateIdPessoas.bind(controller)
  );

  router.delete("/:pessoasId", controller.removeIdPessoas.bind(controller));

  // 5️⃣ Monta rotas no Express
  app.use("/api/pessoas", router);
}

