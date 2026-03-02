 
// src/routes/indexRoute.ts

import { Router } from "express";
import { systemRoutes } from "./systemRoutes";
import { authRoute } from "../use-cases/auth";

const indexRoute = Router();

indexRoute.use("/system", systemRoutes);
indexRoute.use("/auth", authRoute);

export { indexRoute };
