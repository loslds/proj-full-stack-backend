
//C:\repository\proj-full-stack-backend\src\services\grid\cargos\cargosRoutes.ts

import { Router } from "express";
import { getCargosGrid } from "./cargosController";

const cargosRoutes = Router();

cargosRoutes.get("/", getCargosGrid);

export { cargosRoutes };