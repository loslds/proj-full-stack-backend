
//C:\repository\proj-full-stack-backend\src\routes\indexGridRoute.ts

import { Router } from "express";

import { pessoasRoutes } from "../services/grid/pessoas";
import { empresasRoutes } from "../services/grid/empresas";
import { cadastrosRoutes } from "../services/grid/cadastros";
import { visitantesRoutes } from "../services/grid/visitantes";
import { visitasRoutes } from "../services/grid/visitas";
import { consumidoresRoutes } from "../services/grid/consumidores";
import { clientesRoutes } from "../services/grid/clientes";
import { fornecedoresRoutes } from "../services/grid/fornecedores";
import { funcionariosRoutes } from "../services/grid/funcionarios";
import { estadosRoutes } from "../services/grid/estados";
import { cidadesRoutes } from "../services/grid/cidades";
import { imagensRoutes } from "../services/grid/imagens";
import { emailsRoutes } from "../services/grid/emails";
import { docsRoutes } from "../services/grid/docs";
import { fonesRoutes } from "../services/grid/fones";
import { modulosRoutes } from "../services/grid/modulos";
import { cargosRoutes } from "../services/grid/cargos";
import { acoesRoutes } from "../services/grid/acoes";
import { perguntasRoutes } from "../services/grid/perguntas";
import { usersRoutes } from "../services/grid/users";
import { loginsRoutes } from "../services/grid/logins";
import { chavesRoutes } from "../services/grid/chaves";
import { acessosRoutes } from "../services/grid/acessos";
import { pergsrespsRoutes } from "../services/grid/pergsresps";


const indexGridRoute = Router();

indexGridRoute.use("/pessoas", pessoasRoutes);
indexGridRoute.use("/estados", estadosRoutes);
indexGridRoute.use("/cidades", cidadesRoutes);
indexGridRoute.use("/empresas", empresasRoutes);
indexGridRoute.use("/visitantes", visitantesRoutes);
indexGridRoute.use("/visitas", visitasRoutes);
indexGridRoute.use("/consumidores", consumidoresRoutes);
indexGridRoute.use("/clientes", clientesRoutes);
indexGridRoute.use("/fornecedores", fornecedoresRoutes);
indexGridRoute.use("/funcionarios", funcionariosRoutes);
indexGridRoute.use("/cadastros", cadastrosRoutes);
indexGridRoute.use("/imagens", imagensRoutes);
indexGridRoute.use("/emails", emailsRoutes);
indexGridRoute.use("/docs", docsRoutes);
indexGridRoute.use("/fones", fonesRoutes);
indexGridRoute.use("/modulos", modulosRoutes);
indexGridRoute.use("/cargos", cargosRoutes);
indexGridRoute.use("/acoes", acoesRoutes);
indexGridRoute.use("/perguntas", perguntasRoutes);
indexGridRoute.use("/users", usersRoutes);
indexGridRoute.use("/logins", loginsRoutes);
indexGridRoute.use("/chaves", chavesRoutes);
indexGridRoute.use("/acessos", acessosRoutes);
indexGridRoute.use("/pergsresps", pergsrespsRoutes);

export { indexGridRoute };