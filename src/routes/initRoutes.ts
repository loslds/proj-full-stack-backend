


// src/routes/initRoutes.ts
import { Router } from "express";
import { initSystem } from "../services/initSystem";

const router = Router();

// será montado como /api/system/init
router.get("/", async (_req, res) => {
  try {
    const result = await initSystem();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message ?? "Erro interno ao inicializar sistema",
    });
  }
});

export { router as initRoutes };

