import { ClientesController } from '../../../use-cases/cliente/clientes.controller';

//C:\repository\proj-full-stack-backend\src\services\grid\visitantes\visitantesRoutes.ts

import { Router } from "express";
import { getFuncionariosGrid } from "./funcionarioscontroller";

const funcionariosRoutes = Router();

funcionariosRoutes.get("/", getFuncionariosGrid);

export { funcionariosRoutes };