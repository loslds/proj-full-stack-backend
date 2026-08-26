
// C:\repository\proj-full-stack-backend\src\services\grid\pessoas\pessoasRoutes.ts

import { Router } from "express";

import { getServicosGrid } from "./servicosController";

const servicosRoutes = Router();

servicosRoutes.get("/", getServicosGrid);

export { servicosRoutes };

