//C:\repository\proj-full-stack-backend\src\use-cases\estado\initEstadosRoutes.ts
import { AppDataSource } from "../../config/db";
import { Application, Router } from "express";
import { EstadosController } from "./estados.controller";
import { EstadosRepository } from "./estados.repository";
import { estadoscreateValidation, estadosupdateValidation } from "./estados.validation";


export async function initEstadosRoutes(app: Application) {
  // 1️⃣ Repository somente após o DataSource estar inicializado
  const estadosRepo = new EstadosRepository(AppDataSource);

  // 2️⃣ Garantir existência da tabela e dados padrão
  await estadosRepo.createNotExistsEstados();
  await estadosRepo.insertDefaultEstados();

  // 3️⃣ Controller
  const controller = new EstadosController(estadosRepo);

  // 4️⃣ Router
  const router = Router();

  // ======================= ROTAS FIXAS =======================
  router.get("/", controller.findAllEstados.bind(controller));
  router.post("/", estadoscreateValidation, controller.createNewEstados.bind(controller));

  router.get("/search", controller.searchEstadosAll.bind(controller));
  router.get("/search-name", controller.searchEstadosNome.bind(controller));
  router.get("/search-sigla", controller.searchEstadosPrefixo.bind(controller));

  router.get("/one-nome", controller.findOneEstadosNome.bind(controller));
  router.get("/all-nome", controller.findAllEstadosNome.bind(controller));

  router.get("/one-prefixo", controller.findOneEstadosPrefixo.bind(controller));
  router.get("/all-prefixo", controller.findAllEstadosPrefixo.bind(controller));

  // ======================= ROTAS DINÂMICAS =======================
  router.get("/:estadosId", controller.getOneEstadosId.bind(controller));

  router.patch(
    "/:estadosId",
    estadosupdateValidation,
    controller.updateIdEstados.bind(controller)
  );

  router.delete("/:estadosId", controller.removeIdEstados.bind(controller));

  // 5️⃣ Monta rotas no Express
  app.use("/api/estados", router);
}

