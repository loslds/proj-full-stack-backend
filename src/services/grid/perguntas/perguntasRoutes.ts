
//C:\repository\proj-full-stack-backend\src\services\grid\perguntas\perguntasRoutes.ts

import { Router } from "express";
import { getPerguntasGrid } from "./perguntasController";

const perguntasRoutes = Router();

perguntasRoutes.get("/", getPerguntasGrid);

export { perguntasRoutes };