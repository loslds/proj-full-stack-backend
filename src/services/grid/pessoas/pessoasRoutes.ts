
//C:\repository\proj-full-stack-backend\src\services\routes\empresasRoutes.ts

import { Router } from "express";

import { getPessoas } from "./pessoasController.js";

export const pessoasRoutes = Router();

pessoasRoutes.get("/", getPessoas);

export default pessoasRoutes;

