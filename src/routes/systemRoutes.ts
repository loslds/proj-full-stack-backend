
// src/routes/systemRoutes.ts
// src/routes/systemRoutes.ts
import { Router } from "express";

import { initRoutes } from "./initRoutes";
import { systableRoute } from "../use-cases/systable/systables.route";

const systemRoutes = Router();

// Inicialização / verificação do sistema
systemRoutes.use("/init", initRoutes);

// Controle da tabela systables
systemRoutes.use("/systables", systableRoute);

export { systemRoutes };
