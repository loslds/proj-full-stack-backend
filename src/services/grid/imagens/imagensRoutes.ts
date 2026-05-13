
//C:\repository\proj-full-stack-backend\src\services\grid\imagens\imagensRoutes.ts

import { Router } from "express";
import { getImagensGrid } from "./imagensController";

const imagensRoutes = Router();

imagensRoutes.get("/", getImagensGrid);

export { imagensRoutes };