

//C:\repository\proj-full-stack-backend\src\services\grid\controller\grpservicosController.ts

import { Request, Response } from "express";
import { AppDataSource } from "../../../config/db";
import { grpservicosGridSelect } from '../../utility/grpservicos/grpservicosGridSelect';
import { mapGrpservicosGridRow } from "../../utility/grpservicos/mapGrpservicosGridRow";

export async function getGrpservicosGrid(req: Request, res: Response) {
  const rows = await AppDataSource.query(grpservicosGridSelect);

  const result = rows.map(mapGrpservicosGridRow);

  return res.json(result);
}