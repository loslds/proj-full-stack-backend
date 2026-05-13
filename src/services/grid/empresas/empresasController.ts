
//C:\repository\proj-full-stack-backend\src\services\grid\empresas\empresasController.ts

import { Request, Response } from "express";
import { AppDataSource } from "../../../config/db";
import { empresaGridSelect } from "../../utility/empresas/empresaGridSelect";
import { mapEmpresaGridRow } from "../../utility/empresas/mapEmpresaGridRow";

export async function getEmpresas(req: Request, res: Response) {
  const rows = await AppDataSource.query(empresaGridSelect);

  const result = rows.map(mapEmpresaGridRow);

  return res.json(result);
}