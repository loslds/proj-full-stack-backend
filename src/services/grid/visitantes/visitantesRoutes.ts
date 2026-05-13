
//C:\repository\proj-full-stack-backend\src\services\grid\visitantes\visitantesRoutes.ts

import { Router } from "express";
import { getVisitantesGrid } from "./visitantescontroller";

const visitantesRoutes = Router();

visitantesRoutes.get("/", getVisitantesGrid);

export { visitantesRoutes };