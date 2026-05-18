
//C:\repository\proj-full-stack-backend\src\services\routes\cadastrosRoutes.ts

import { Router } from "express";
import { getCadastrosGrid } from "./cadastrosController";

export const cadastrosRoutes = Router();

cadastrosRoutes.get("/", getCadastrosGrid);

export default cadastrosRoutes;

