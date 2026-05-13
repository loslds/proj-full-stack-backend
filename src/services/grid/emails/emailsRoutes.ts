
//C:\repository\proj-full-stack-backend\src\services\grid\emails\emailsRoutes.ts

import { Router } from "express";
import { getEmailsGrid } from "./emailsController";

const emailsRoutes = Router();

emailsRoutes.get("/", getEmailsGrid);

export { emailsRoutes };