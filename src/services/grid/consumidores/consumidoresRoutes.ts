
//C:\repository\proj-full-stack-backend\src\services\grid\consumidores\consumidoresRoutes.ts

import { Router } from "express";
import { getConsumidoresGrid } from "./consumidorescontroller";

const consumidoresRoutes = Router();

consumidoresRoutes.get("/", getConsumidoresGrid);

export { consumidoresRoutes };