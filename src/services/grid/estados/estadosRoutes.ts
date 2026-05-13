
//C:\repository\proj-full-stack-backend\src\services\grid\estados\estadosRoutes.ts

import { Router } from "express";
import { getEstadosGrid } from "./estadosController";

const estadosRoutes = Router();

estadosRoutes.get("/", getEstadosGrid);

export { estadosRoutes };