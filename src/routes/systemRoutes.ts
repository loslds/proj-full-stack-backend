
// src/routes/systemRoutes.ts
import { Router } from "express";

// rotas do sistema
import { initRoutes } from "./initRoutes";

// use-cases
import { systableRoute } from "../use-cases/systable/systables.route";

const systemRoutes = Router();

// -----------------------------
// Inicialização / verificação do sistema
// -----------------------------
systemRoutes.use("/init", initRoutes);

// -----------------------------
// Controle da tabela systables
// -----------------------------
systemRoutes.use("/systables", systableRoute);

// -----------------------------
// Sincronização / manutenção
// -----------------------------
//systemRoutes.use("/sync", syncTablesRoutes);

export { systemRoutes };

