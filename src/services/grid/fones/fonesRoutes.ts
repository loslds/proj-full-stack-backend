
//C:\repository\proj-full-stack-backend\src\services\grid\fones\fonesRoutes.ts

import { Router } from "express";
import { getFonesGrid } from "./fonesController";

const fonesRoutes = Router();

fonesRoutes.get("/", getFonesGrid);

export { fonesRoutes };