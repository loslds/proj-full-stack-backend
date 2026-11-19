

//C:\repository\proj-full-stack-backend\src\services\grid\controller\pessoasController.ts

import { Request, Response } from "express";
import { AppDataSource } from "../../../config/db";
import { servicosGridSelect } from '../../utility/servicos/servicosGridSelect';
import { mapServicosGridRow } from "../../utility/servicos/mapServicosGridRow";

export async function getServicosGrid(req: Request, res: Response) {
  const rows = await AppDataSource.query(servicosGridSelect);

  const result = rows.map(mapServicosGridRow);

  return res.json(result);
}