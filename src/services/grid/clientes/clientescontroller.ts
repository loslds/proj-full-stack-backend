
//C:\repository\proj-full-stack-backend\src\services\grid\clientes\clientescontroller.ts

import { Request, Response } from "express";
import { AppDataSource } from "../../../config/db";
import { clientesGridSelect } from "../../utility/clientes/clientesGridSelect";
import { mapClientesGridRow } from "../../utility/clientes/mapClientesGridRow";

export async function getClientesGrid(req: Request, res: Response) {
  const rows = await AppDataSource.query(clientesGridSelect);

  const result = rows.map(mapClientesGridRow);

  return res.json(result);
}