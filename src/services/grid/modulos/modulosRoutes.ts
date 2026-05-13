
//C:\repository\proj-full-stack-backend\src\services\grid\modulos\modulosRoutes.ts

import { Router } from "express";
import { getModulosGrid } from "./modulosController";

const modulosRoutes = Router();

modulosRoutes.get("/", getModulosGrid);

export { modulosRoutes };
