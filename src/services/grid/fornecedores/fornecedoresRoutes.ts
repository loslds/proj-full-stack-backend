

//C:\repository\proj-full-stack-backend\src\services\grid\fornecedores\fornecedoresRoutes.ts

import { Router } from "express";
import { getFornecedoresGrid } from "./fornecedorescontroller";

const fornecedoresRoutes = Router();

fornecedoresRoutes.get("/", getFornecedoresGrid);

export { fornecedoresRoutes };