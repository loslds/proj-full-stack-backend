
// /routes/systemRoutes.ts
import { Router } from "express";
import { systableRoute } from "../use-cases/systable/systables.route";
import { pessoasRoutes } from "../use-cases/pessoa/pessoas.route";
import { empresasRoutes } from "../use-cases/empresa/empresas.route";
import { syncTablesRoutes } from "./syncTablesRoutes"; // novo

const systemRoutes = Router();

// agora centralizamos as rotas do sistema aqui
systemRoutes.use("/systables", systableRoute);
systemRoutes.use("/pessoas", pessoasRoutes);
systemRoutes.use("/empresas", empresasRoutes);
systemRoutes.use("/sync", syncTablesRoutes);

export { systemRoutes };