
//C:\repository\proj-full-stack-backend\src\services\controller\empresasController.ts

import { Request, Response } from "express";
import { AppDataSource } from "../../../config/db";
import { grpservicosGridSelect } from "../grpservicos/grpservicosGridSelect";
import { mapGrpservicosGridRow } from "../grpservicos/mapGrpservicosGridRow";

export async function getGrpservicos(req: Request, res: Response) {
  const rows = await AppDataSource.query(grpservicosGridSelect);

  const result = rows.map(mapGrpservicosGridRow);

  return res.json(result);
}