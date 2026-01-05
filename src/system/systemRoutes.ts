
// src/routes/systemRoutes.ts
import { Router } from "express";

// rotas do sistema
import { initRoutes } from "../routes/initRoutes";
import { syncTablesRoutes } from "../routes/syncTablesRoutes";

// use-cases
import { systableRoute } from "../use-cases/systable/systables.route";

const systemRoutes = Router();

// -----------------------------
// Inicialização / verificação do sistema
// -----------------------------
systemRoutes.use("/init", initRoutes);

// -----------------------------
// Controle da tabela systables
// -----------------------------
systemRoutes.use("/systables", systableRoute);

// -----------------------------
// Sincronização / manutenção
// -----------------------------
systemRoutes.use("/sync", syncTablesRoutes);

export { systemRoutes };


// import { Router } from "express";
// import { initRoutes } from "../routes/initRoutes";
// import { systableRoute } from "../use-cases/systable/systables.route";
// import { syncTablesRoutes } from "../routes/syncTablesRoutes";

// const systemRoutes = Router();

// systemRoutes.use("/init", initRoutes);
// systemRoutes.use("/systables", systableRoute);
// systemRoutes.use("/sync", syncTablesRoutes);

// export { systemRoutes };


// // src/routes/systemRoutes.ts
// import { Router } from "express";
// import { initRoutes } from "./initRoutes";
// import { systableRoute } from "../use-cases/systable/systables.route";
// import { syncTablesRoutes } from "./syncTablesRoutes";

// const systemRoutes = Router();

// systemRoutes.use("/init", initRoutes);
// systemRoutes.use("/systables", systableRoute);
// systemRoutes.use("/sync", syncTablesRoutes);

// export { systemRoutes };






// // /routes/systemRoutes.ts
// import { Router } from "express";
// import { systableRoute } from "../use-cases/systable/systables.route";
// //import { pessoasRoutes } from "../use-cases/pessoa/pessoas.route";
// //import { empresasRoutes } from "../use-cases/empresa/empresas.route";
// import { syncTablesRoutes } from "./syncTablesRoutes"; // novo

// const systemRoutes = Router();

// // agora centralizamos as rotas do sistema aqui
// systemRoutes.use("/systables", systableRoute);
// //systemRoutes.use("/pessoas", pessoasRoutes);
// //systemRoutes.use("/empresas", empresasRoutes);

// systemRoutes.use("/sync", syncTablesRoutes);

// export { systemRoutes };

