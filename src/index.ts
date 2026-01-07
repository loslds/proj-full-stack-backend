
// src/index.ts
import net from "net";
import express from "express";
import cors from "cors";

import { AppDataSource } from "./config/db";
import { indexRoute } from "./routes/indexRoute";
import { errorHandler } from "./middlewares/errorHandler";
import { appPort, frontendPort } from "./config/app";
import logsRoute from "./use-cases/system/logs.route";
import { systemHealthCheck } from "./services/systemHealthCheck";

// ==================================================
// 1️⃣ Verifica se a porta está livre
// ==================================================
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

// ==================================================
// 2️⃣ Cria app Express
// ==================================================
const app = express();

// ==================================================
// 3️⃣ Configuração de CORS
// ==================================================
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      // aceita localhost (dev)
      if (/^http:\/\/localhost:\d+$/.test(origin)) {
        return callback(null, true);
      }

      callback(new Error("Origem não permitida pelo CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ==================================================
// 4️⃣ Rotas
// ==================================================
app.use("/api", indexRoute);      // 🔥 rotas do sistema
app.use("/api/logs", logsRoute);  // exceção funcional

// ==================================================
// 5️⃣ Middleware global de erro
// ==================================================
app.use(errorHandler);

// ==================================================
// 6️⃣ Inicialização do banco + health check + servidor
// ==================================================
(async () => {
  try {
    await AppDataSource.initialize();
    console.log("✅ Conectado ao banco de dados");

    // 🔍 Verificação leve de integridade (runtime)
    await systemHealthCheck();
    console.log("✅ System health check OK");

    app.listen(appPort, () => {
      console.log(`🚀 Backend rodando na porta ${appPort}`);
      console.log(`🖥️ Frontend esperado na porta ${frontendPort}`);
    });
  } catch (err) {
    console.error("❌ Erro crítico ao iniciar o sistema:", err);
    process.exit(1);
  }
})();
