
// C:\repository\proj-full-stack-backend\src\routes\systemRoutes.ts
import { Router } from "express";
import { initRoutes } from "./initRoutes";
import { systableRoute } from "../use-cases/systable/systables.route";
import { systemHealthCheck } from "../services/systemHealthCheck";
import { systemTableRoute } from "../system/systemTable.route";

const systemRoutes = Router();

// -----------------------------
// Inicialização / instalação
// -----------------------------
systemRoutes.use("/init", initRoutes);

// -----------------------------
// Controle da tabela systables
// -----------------------------
systemRoutes.use("/systables", systableRoute);

// -----------------------------
// Health / estado do sistema (LEVE | DEV | PROD)
// -----------------------------
systemRoutes.get("/health", async (_req, res) => {
  const health = await systemHealthCheck();
  res.json(health);
});

systemRoutes.use("/", systemTableRoute);

export { systemRoutes };

