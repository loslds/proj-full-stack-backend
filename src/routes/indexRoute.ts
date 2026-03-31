
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
import { empresasRoutes } from '../use-cases/empresa';
import { visitantesRoutes } from '../use-cases/visitante';
import { visitasRoutes } from '../use-cases/visita';
import { consumidoresRoutes } from '../use-cases/consumidor';
import { clientesRoutes } from '../use-cases/cliente';
import { fornecedoresRoutes } from '../use-cases/fornecedor';
import { funcionariosRoutes } from '../use-cases/funcionario';
import { cadastrosRoutes } from '../use-cases/cadastro';
import { emailsRoutes } from '../use-cases/email';
import { docsRoutes } from '../use-cases/doc';
import { fonesRoutes } from '../use-cases/fone';


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

indexRoute.use("empresas", empresasRoutes);
indexRoute.use("/visitantes", visitantesRoutes);
indexRoute.use("/visitas", visitasRoutes);
indexRoute.use("/consumidores", consumidoresRoutes);
indexRoute.use("/clientes", clientesRoutes);
indexRoute.use("/fornecedores", fornecedoresRoutes);
indexRoute.use("/funcionarios", funcionariosRoutes);
indexRoute.use("/cadastros", cadastrosRoutes);
indexRoute.use("/emails", emailsRoutes);
indexRoute.use("/docs", docsRoutes);
indexRoute.use("/fones", fonesRoutes);


export { indexRoute };