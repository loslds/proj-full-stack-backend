
// C:\repository\proj-full-stack-backend\src\services\grid\pessoas\pessoasRoutes.ts

import { Router } from "express";

import { getPessoasGrid } from "./pessoasController";

const pessoasRoutes = Router();

pessoasRoutes.get("/", getPessoasGrid);

export { pessoasRoutes };

