
//C:\repository\proj-full-stack-backend\src\services\routes\empresasRoutes.ts

import { Router } from "express";

import { getEmpresasGrid } from "../empresas/empresasController";

export const empresasRoutes = Router();

empresasRoutes.get("/", getEmpresasGrid);

export default empresasRoutes;

