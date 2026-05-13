
//C:\repository\proj-full-stack-backend\src\services\grid\acoes\acoesRoutes.ts

import { Router } from "express";
import { getAcoesGrid } from "./acoesController";

const acoesRoutes = Router();

acoesRoutes.get("/", getAcoesGrid);

export { acoesRoutes };