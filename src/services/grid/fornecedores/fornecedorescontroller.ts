
//C:\repository\proj-full-stack-backend\src\services\grid\fornecedores\fornecedorescontroller.ts

import { Request, Response } from "express";
import { AppDataSource } from "../../../config/db";
import { fornecedoresGridSelect } from "../../utility/fornecedores/fornecedoresGridSelect";
import { mapFornecedoresGridRow } from "../../utility/fornecedores/mapFornecedoresGridRow";

export async function getFornecedoresGrid(req: Request, res: Response) {
  const rows = await AppDataSource.query(fornecedoresGridSelect);

  const result = rows.map(mapFornecedoresGridRow);

  return res.json(result);
}