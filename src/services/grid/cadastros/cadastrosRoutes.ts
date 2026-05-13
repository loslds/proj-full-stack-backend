
//C:\repository\proj-full-stack-backend\src\services\routes\cadastrosRoutes.ts

import { Router } from "express";
import { getCadastros } from "./cadastrosController";

export const cadastrosRoutes = Router();

cadastrosRoutes.get("/", getCadastros);

export default cadastrosRoutes;

