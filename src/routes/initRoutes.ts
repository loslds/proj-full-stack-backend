
// C:\repository\proj-full-stack-backend\src\routes\initRoutes.ts

// src/routes/initRoutes.ts
import { Router } from "express";
import { initSystem } from "../services/initService"; // ajusta o caminho se estiver diferente

const router = Router();

// aqui o endpoint é /api/db/init  (porque o prefixo já vem do index.ts)
router.get("/", async (req, res) => {
  try {
    const result = await initSystem();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export { router as initRoutes };
