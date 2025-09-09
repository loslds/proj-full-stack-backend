
// C:\repository\proj-full-stack-backend\src\routes\initRoutes.ts

import { Router } from "express";
import { initSystem } from "../services/initService";

export const initRoutes = Router();

initRoutes.get("/", async (req, res) => {
  const result = await initSystem();
  if (!result.success) {
    return res.status(500).json(result);
  }
  return res.json(result);
});
