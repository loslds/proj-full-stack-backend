
//C:\repository\proj-full-stack-backend\src\services\grid\visitas\visitasRoutes.ts

import { Router } from "express";
import { getVisitasGrid } from "./visitasController";

const visitasRoutes = Router();

visitasRoutes.get("/", getVisitasGrid);

export { visitasRoutes };