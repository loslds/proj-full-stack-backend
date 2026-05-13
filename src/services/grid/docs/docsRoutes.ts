
//C:\repository\proj-full-stack-backend\src\services\grid\docs\docsRoutes.ts

import { Router } from "express";
import { getDocsGrid } from "./docsController";

const docsRoutes = Router();

docsRoutes.get("/", getDocsGrid);

export { docsRoutes };