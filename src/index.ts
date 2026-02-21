
// C:\repository\proj-full-stack-backend\src\index.ts
import "dotenv/config";

console.log("ENV MASTER_KEY loaded?", Boolean(process.env.MASTER_KEY));

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
      if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
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
    // 🔹 Inicializa DataSource
    await AppDataSource.initialize();
    console.log("✅ Conectado ao banco de dados");

    // 🔹 Health check do sistema
    // Se for primeira execução (modo DEV / instalação), o modal frontend poderá receber mensagens
    const healthResult = await systemHealthCheck();

    console.log(
      `🩺 Health | mode=${healthResult.mode} | initialized=${healthResult.initialized}`
    );

    if (healthResult.missingTables.length > 0) {
      console.warn(
        "⚠️ Tabelas ausentes:",
        healthResult.missingTables
      );
    }

    // 🔹 Inicia servidor
    app.listen(appPort, () => {
      console.log(`🚀 Backend rodando na porta ${appPort}`);
      console.log(`🖥️ Frontend esperado na porta ${frontendPort}`);

      // opcional: informar modo DEV se modal for necessário
      if (!healthResult.success) {
        console.log("⚠️ Modo DEV: algumas tabelas ausentes, sistema em verificação.");
      }
    });

  } catch (err) {
    console.error("❌ Erro crítico ao iniciar o sistema:", err);
    process.exit(1);
  }
})();

