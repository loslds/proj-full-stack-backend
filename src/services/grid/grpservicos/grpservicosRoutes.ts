
// C:\repository\proj-full-stack-backend\src\services\grid\grpservicos\grpservicosRoutes.ts

import { Router } from "express";

import { getGrpservicosGrid } from "./grpservicosController";

const grpservicosRoutes = Router();

grpservicosRoutes.get("/", getGrpservicosGrid);

export { grpservicosRoutes };

