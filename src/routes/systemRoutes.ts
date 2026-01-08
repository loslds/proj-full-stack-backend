
// // src/routes/systemRoutes.ts

import { Router } from "express";
import { initRoutes } from "./initRoutes";
import { systableRoute } from "../use-cases/systable/systables.route";
import { systemHealthCheck } from "../services/systemHealthCheck";

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

export { systemRoutes };




// import { Router } from "express";

// // rotas de inicialização
// import { initRoutes } from "./initRoutes";

// // use-cases
// import { systableRoute } from "../use-cases/systable/systables.route";

// // serviços
// import { systemHealthCheck } from "../services/systemHealthCheck";

// const systemRoutes = Router();

// // ==================================================
// // Inicialização / diagnóstico do sistema
// // ==================================================
// systemRoutes.use("/init", initRoutes);

// // ==================================================
// // Controle da tabela systables
// // ==================================================
// systemRoutes.use("/systables", systableRoute);

// // ==================================================
// // Health / State (somente leitura)
// // ==================================================
// systemRoutes.get("/health", async (_req, res) => {
//   try {
//     const health = await systemHealthCheck();

//     res.json({
//       success: true,
//       status: health.status,          // "LEVE" | "DEV"
//       initialized: health.initialized,
//       missingTables: health.missingTables,
//       timestamp: new Date().toISOString(),
//     });
//   } catch (error: unknown) {
//     const msg = error instanceof Error ? error.message : "Erro desconhecido";

//     res.status(500).json({
//       success: false,
//       status: "LEVE",
//       initialized: false,
//       message: msg,
//       timestamp: new Date().toISOString(),
//     });
//   }
// });

// export { systemRoutes };
