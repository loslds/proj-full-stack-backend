
// C:\repository\proj-full-stack-backend\src\routes\logsRoutes.ts

import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";

const logsRoutes = Router();

// Pasta onde os logs serão salvos
const logsDir = path.join(__dirname, "../../logs");

// Garante que a pasta exista
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * POST /api/logs
 * Recebe um log do frontend e salva em um arquivo
 */
logsRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const { origem, mensagem, data } = req.body;

    if (!origem || !mensagem || !data) {
      return res.status(400).json({ success: false, message: "Campos obrigatórios: origem, mensagem, data" });
    }

    const logLine = `[${data}] [${origem}] ${mensagem}\n`;

    const logFile = path.join(logsDir, "system_logs.txt");

    // Append no arquivo
    fs.appendFile(logFile, logLine, (err) => {
      if (err) {
        console.error("Erro ao salvar log:", err);
        return res.status(500).json({ success: false, message: "Falha ao salvar log" });
      }

      res.status(200).json({ success: true, message: "Log registrado com sucesso" });
    });
  } catch (error) {
    console.error("Erro no endpoint /api/logs:", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
});

export default logsRoutes;

