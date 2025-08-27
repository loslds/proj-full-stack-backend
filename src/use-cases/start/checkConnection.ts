
// src/use-cases/start/checkConnection.ts
import { Router, Request, Response } from "express";
import { dbSource } from "./dbSource";

export const checkConnection = Router();

checkConnection.get("/check-connection", async (req: Request, res: Response) => {
  try {
    if (!dbSource.isInitialized) {
      await dbSource.initialize();
    }
    res.json({ success: true, message: "Conectado ao banco de dados!" });
  } catch (err) {
    console.error("Erro ao verificar conexão:", err);
    res.status(500).json({ success: false, message: "Conexão falhou." });
  }
});
