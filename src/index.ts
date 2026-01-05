
// src/index.tsx
import net from "net";
import express from "express";
import cors from "cors";

import { AppDataSource } from "./config/db";
import { indexRoute } from "./routes/indexRoute";
import { errorHandler } from "./middlewares/errorHandler";
import { appPort, frontendPort } from "./config/app";
import logsRoute from "./use-cases/system/logs.route";

// -----------------------------
// 1️⃣ Verifica se a porta está livre
// -----------------------------
const serverCheck = net.createServer();

serverCheck.once("error", (err: any) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Porta ${appPort} já está em uso.`);
    process.exit(1);
  }
});

serverCheck.once("listening", () => {
  serverCheck.close();
});

serverCheck.listen(appPort);

// -----------------------------
// 2️⃣ Cria app Express
// -----------------------------
const app = express();

// -----------------------------
// 3️⃣ Configuração de CORS
// -----------------------------
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
      callback(new Error("Origem não permitida pelo CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// -----------------------------
// 4️⃣ Rotas
// -----------------------------
app.use("/api", indexRoute);        // 🔥 TODAS AS ROTAS DO SISTEMA
app.use("/api/logs", logsRoute);    // exceção funcional (ok)

// -----------------------------
// 5️⃣ Middleware de erro
// -----------------------------
app.use(errorHandler);

// -----------------------------
// 6️⃣ Inicializa banco e servidor
// -----------------------------
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Conectado ao banco de dados");

    app.listen(appPort, () => {
      console.log(`🚀 Backend rodando na porta ${appPort}`);
      console.log(`🖥️ Frontend esperado na porta ${frontendPort}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar no banco:", err);
    process.exit(1);
  });

  