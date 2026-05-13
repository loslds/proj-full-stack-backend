
//C:\repository\proj-full-stack-backend\src\services\routes\empresasRoutes.ts

import { Router } from "express";

import { getEmpresas } from "../empresas/empresasController";

export const empresasRoutes = Router();

empresasRoutes.get("/", getEmpresas);

export default empresasRoutes;

