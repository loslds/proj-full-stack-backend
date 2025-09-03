
// /routes/syncTablesRoutes.ts

// routes/syncTablesRoutes.ts
import { Router } from "express";
import { syncSysTables } from "../services/syncsysTables";
import { requiredTables } from "../config/tables";

export const syncTablesRoutes = Router();

syncTablesRoutes.get("/", async (req, res) => {
  try {
    const result = await syncSysTables(requiredTables);
    res.json({ success: true, data: result });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Erro ao sincronizar:", err.message);
      res.status(500).json({ success: false, message: err.message });
    } else {
      console.error("Erro desconhecido ao sincronizar:", err);
      res.status(500).json({ success: false, message: "Erro desconhecido" });
    }
  }
});
