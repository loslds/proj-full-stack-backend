import { acoesSeed } from './../services/table/seed/acoes.seed';

// C:\repository\proj-full-stack-backend\src\routes\indexRoute.ts

import { Router } from "express";

import { systemRoutes } from "./systemRoutes";
import { authRoute } from "../use-cases/auth";

import { pessoasRoutes } from "../use-cases/pessoa";
import { estadosRoutes } from "../use-cases/estado";
import { cidadesRoutes } from "../use-cases/cidade";
import { imagensRoutes } from "../use-cases/imagen";
import { modulosRoutes } from "../use-cases/modulo";
import { cargosRoutes } from "../use-cases/cargo";
import { acoesRoutes } from "../use-cases/acao";
import { perguntasRoutes } from '../use-cases/perguntas';


const indexRoute = Router();

// rotas do sistema
indexRoute.use("/system", systemRoutes);

// autenticação
indexRoute.use("/auth", authRoute);

// arquivos para os módulos do sistema
indexRoute.use("/pessoas", pessoasRoutes);
indexRoute.use("/estados", estadosRoutes);
indexRoute.use("/cidades", cidadesRoutes);
indexRoute.use("/imagens", imagensRoutes);
indexRoute.use("/modulos", modulosRoutes);
indexRoute.use("/cargos", cargosRoutes);
indexRoute.use("/acoes", acoesRoutes);
indexRoute.use("/perguntas", perguntasRoutes);


export { indexRoute };