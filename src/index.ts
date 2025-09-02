
// src/index.tsx
import express from 'express';
import cors from 'cors';
import { dbSource } from './database';
import { indexRoute } from './routes/indexRoute';
import { errorHandler } from './middlewares/errorHandler';
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


