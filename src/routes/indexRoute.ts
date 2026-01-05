 
// src/routes/indexRoute.ts
import { Router } from "express";
import { systemRoutes } from "../system/systemRoutes";

const indexRoute = Router();

// -----------------------------
// Rotas do sistema
// -----------------------------
indexRoute.use("/system", systemRoutes);

// -----------------------------
// Health-check da API
// -----------------------------
indexRoute.get("/", (_req, res) => {
  res.status(200).json({ success: true });
});

export { indexRoute };
