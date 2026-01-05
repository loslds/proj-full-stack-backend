

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



// // C:\repository\proj-full-stack-backend\src\routes\initRoutes.ts
// import { Router } from "express";
// import { initSystem } from "../services/initSystem"; // ajusta o caminho se estiver diferente

// const router = Router();

// // aqui o endpoint é /api/db/init  (porque o prefixo já vem do index.ts)
// router.get("/", async (req, res) => {
//   try {
//     const result = await initSystem();
//     res.json(result);
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// export { router as initRoutes };

