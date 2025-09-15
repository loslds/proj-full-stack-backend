
// C:\repository\proj-full-stack-backend\src\use-cases\system\logs.route.ts

import { Router, Request, Response } from "express";

const router = Router();

// Rota para receber logs do frontend
router.post("/", async (req: Request, res: Response) => {
  try {
    const { origem, mensagem, data } = req.body;

    // Log no console (ou salvar no banco depois)
    console.log(`[LOG - ${data}] [${origem}] ${mensagem}`);

    // Retorna sucesso
    return res.status(201).json({ success: true, message: "Log recebido" });
  } catch (err) {
    console.error("Erro ao salvar log:", err);
    return res.status(500).json({ success: false, message: "Erro no servidor" });
  }
});

export default router;
