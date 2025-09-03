
// /routes/checkTablesRoutes.ts
// src/routes/checkTablesRoutes.ts
import { Router } from "express";
import { checkTables } from "../services/checkTables";

export const checkTablesRoutes = Router();

checkTablesRoutes.get("/", async (req, res) => {
  const result = await checkTables();
  res.json(result);
});
