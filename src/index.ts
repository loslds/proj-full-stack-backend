
// src/index.tsx
import net from 'net';
import express from "express";
import cors from "cors";
import { dbSource } from './database';
import { indexRoute } from './routes/indexRoute';
import { errorHandler } from './middlewares/errorHandler';
import { appPort, frontendPort, frontendDomain } from "./config/app";
import logsRoute from "./use-cases/system/logs.route";
import { initRoutes } from "./routes/initRoutes";

// -----------------------------
// 1️⃣ Verifica se a porta está livre
// -----------------------------
const serverCheck = net.createServer().listen(appPort);
serverCheck.on("error", (err: any) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Porta ${appPort} já está em uso. Finalize o processo antigo.`);
    process.exit(1);
  }
});
serverCheck.close();

// -----------------------------
// 2️⃣ Cria app Express
// -----------------------------
const app = express();

// -----------------------------
// 3️⃣ Configuração segura de CORS
// -----------------------------
const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    // Permite requisições sem origem (Postman ou curl)
    if (!origin) return callback(null, true);

    // Permite qualquer localhost com qualquer porta no dev
    if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);

    // Permite domínio de produção definido
    const allowedProduction = ["https://meusite.com"];
    if (allowedProduction.includes(origin)) return callback(null, true);

    // Bloqueia qualquer outra origem
    callback(new Error("❌ Requisição bloqueada pelo CORS: Origem não permitida."));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json()); // interpreta JSON no body

// -----------------------------
// 4️⃣ Rotas
// -----------------------------
app.use("/api/logs", logsRoute);
app.use('/api', indexRoute);         // rotas principais do sistema
app.use("/api/db/init", initRoutes); // inicialização/check do sistema

// -----------------------------
// 5️⃣ Middleware de tratamento de erros
// -----------------------------
app.use(errorHandler);

// -----------------------------
// 6️⃣ Inicializa conexão com o banco e inicia servidor
// -----------------------------
dbSource.initialize()
  .then(() => {
    console.log("✅ Conectado ao banco de dados!");
    app.listen(appPort, () => {
      console.log(`🚀 Servidor rodando na porta ${appPort}`);
      console.log(`🚀 Frontend está rodando na porta ${frontendPort}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar ao banco de dados:", err);
    process.exit(1);
  });
