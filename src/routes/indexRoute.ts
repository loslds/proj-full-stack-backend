
// C:\repository\proj-full-stack-backend\src\routes\indexRoute.ts

import { Router } from "express";

import { systemRoutes } from "./systemRoutes";
import { authRoute } from "../use-cases/auth";

import { pessoasRoutes } from "../use-cases/pessoa";
import { estadosRoutes } from "../use-cases/estado";
import { cidadesRoutes } from "../use-cases/cidade";
import { imagensRoutes } from "../use-cases/imagen";

const indexRoute = Router();

// rotas do sistema
indexRoute.use("/system", systemRoutes);

// autenticação
indexRoute.use("/auth", authRoute);

// módulos do sistema
indexRoute.use("/pessoas", pessoasRoutes);
indexRoute.use("/estados", estadosRoutes);
indexRoute.use("/cidades", cidadesRoutes);
indexRoute.use("/imagens", imagensRoutes);

export { indexRoute };