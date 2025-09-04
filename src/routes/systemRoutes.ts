
// /routes/systemRoutes.ts
import { Router } from "express";
import { systableRoute } from "../use-cases/systable";
import { pessoasRoute } from "../use-cases/pessoa";
import { empresasRoute } from "../use-cases/empresa";
import { syncTablesRoutes } from "./syncTablesRoutes"; // novo

const systemRoutes = Router();

// agora centralizamos as rotas do sistema aqui
systemRoutes.use("/systables", systableRoute);
systemRoutes.use("/pessoas", pessoasRoute);
systemRoutes.use("/empresas", empresasRoute);
systemRoutes.use("/sync", syncTablesRoutes);

export { systemRoutes };