 
// src/routes/indexRoute.ts
import { Router } from "express";
import { systemRoutes } from "./systemRoutes";

const router = Router();

router.use("/system", systemRoutes);

export { router as indexRoute };
