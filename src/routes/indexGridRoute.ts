
//C:\repository\proj-full-stack-backend\src\routes\indexGridRoute.ts

import { Router } from "express";

import { empresasRoutes } from "../services/grid/empresas";
import { cadastrosRoutes } from "../services/grid/cadastros";

const indexGridRoute = Router();

indexGridRoute.use("/empresas", empresasRoutes);
indexGridRoute.use("/cadastros", cadastrosRoutes);

export { indexGridRoute };