
//C:\repository\proj-full-stack-backend\src\system\systemTable.route.ts
import { Router } from "express";
import { SystemTableController } from "./systemTable.controller";

export const systemTableRoute = Router();
const controller = new SystemTableController();

systemTableRoute.get("/table/:tableName", controller.getTableByName);