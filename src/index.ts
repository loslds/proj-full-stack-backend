
// src/index.tsx
import express from "express";
import cors from "cors";
import { dbSource } from './database';
import { indexRoute } from './routes/indexRoute';
import { errorHandler } from './middlewares/errorHandler';
import { appPort, frontendPort, frontendDomain } from "./config/app";
import { initRoutes } from "./routes/initRoutes";

const app = express();

// Configuração segura de CORS
const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    // Permite requisições sem origem (ex.: Postman ou curl)
    if (!origin) return callback(null, true);

    // Aceita qualquer localhost com qualquer porta no dev
    if (/^http:\/\/localhost:\d+$/.test(origin)) {
      return callback(null, true);
    }

    // Permite seu domínio de produção
    const allowedProduction = ["https://meusite.com"];
    if (allowedProduction.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error("❌ Requisição bloqueada pelo CORS: Origem não permitida."));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

app.use(express.json());

// ... suas rotas e middlewares
app.use('/api', indexRoute);

app.use("/api/db/init", initRoutes);

app.use(errorHandler);

// Inicializa conexão com o banco e depois inicia o servidor
dbSource.initialize()
  .then(() => {
    console.log("✅ Conectado ao banco de dados!");
    app.listen(appPort, () => {
      console.log(`🚀 Servidor rodando na porta ${appPort}`);
      
    });
    console.log(`🚀 Frontend está rodando na porta ${frontendPort}`);
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar ao banco de dados:", err);
  });


//////////////////////////////////////////////////////////////////

//import express from 'express';
//import cors from 'cors';
//import { dbSource } from './database';
//import { indexRoute } from './routes/indexRoute';
//import { errorHandler } from './middlewares/errorHandler';
//import { appPort, frontendPort } from './config/app';

//import { initRoutes } from "./routes/initRoutes";

//const app = express();

// Middlewares
// app.use(
//   cors({
//     origin: `http://localhost:${frontendPort}`,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"]
//   })
// );

// app.use(express.json());

// // Rotas
// app.use('/api', indexRoute);

//app.use("/api/db", checkConnection);

//app.use("/api/db/check-tables", checkTablesRoutes);

// app.use("/api/db/init", initRoutes);

// Middleware de tratamento de erro
// app.use(errorHandler);

// Inicializa conexão com o banco e depois inicia o servidor
// dbSource.initialize()
//   .then(() => {
//     console.log("✅ Conectado ao banco de dados!");
//     app.listen(appPort, () => {
//       console.log(`🚀 Servidor rodando na porta ${appPort}`);
      
//     });
//     console.log(`🚀 Frontend está rodando na porta ${frontendPort}`);
//   })
//   .catch((err) => {
//     console.error("❌ Erro ao conectar ao banco de dados:", err);
//   });


