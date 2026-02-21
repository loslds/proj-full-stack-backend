
//C:\repository\proj-full-stack-backend\src\use-cases\auth\auth.route.ts
import { Router } from "express";
import { AuthController } from "./auth.controller";

export const authRoute = Router();

const controller = new AuthController();

authRoute.post("/master", controller.master);
