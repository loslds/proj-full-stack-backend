
//C:\repository\proj-full-stack-backend\src\services\grid\cidades\cidadesRoutes.ts

import { Router } from "express";
import { getCidadesGrid } from "./cidadesController";

const cidadesRoutes = Router();

cidadesRoutes.get("/", getCidadesGrid);

export { cidadesRoutes };