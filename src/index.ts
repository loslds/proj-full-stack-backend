
// src/index.tsx
import express from 'express';
import cors from 'cors';
import { dbSource } from './use-cases/start/dbSource';
import { indexRoute } from './use-cases/index.route';
import { errorHandler } from './services/errorHandler';
import { appPort, frontendPort } from './config/app';
import { checkConnection } from "./use-cases/start/checkConnection";

const app = express();

// Middlewares
app.use(
  cors({
    origin: `http://localhost:${frontendPort}`,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

// Rotas
app.use('/api', indexRoute);

app.use("/api/db", checkConnection);

// Middleware de tratamento de erro
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



// import express from 'express';
// import cors from 'cors';
// import { startServer } from './startServer';
// import { appPort } from './config/app';
// import { dbSource } from './use-cases/start/dbSource';
// import { indexRoute } from './use-cases/index.route';

// const app = express();

// // Middleware CORS
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"]
//   })
// );

// // Middleware para JSON
// app.use(express.json());

// // Rotas principais
// app.use('/api', indexRoute);

// // Inicia servidor + conexão com banco
// startServer(dbSource, app);


// /////////////////////////////////////////////////
// import express from 'express';
// import cors from 'cors';
// import { startServer } from './startServer';
// import { appPort } from './config/app';
// import { dbSource } from './use-cases/start/dbSource';
// import { indexRoute } from './use-cases/index.route'; // seu arquivo de rotas principal

// const app = express();

// // Middleware CORS
// app.use(
//   cors({
//     origin: "http://localhost:5173", // ✅ libera seu frontend correto
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"]
//   })
// );

// // Middleware para JSON
// app.use(express.json());

// // Registra suas rotas
// app.use('/api', indexRoute);

// // Inicia servidor + conexão banco
// startServer(dbSource, app);


