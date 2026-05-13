
//C:\repository\proj-full-stack-backend\src\services\grid\clientes\clientesRoutes.ts

import { Router } from "express";
import { getClientesGrid } from "./clientescontroller";

const clientesRoutes = Router();

clientesRoutes.get("/", getClientesGrid);

export { clientesRoutes };