
//C:\repository\proj-full-stack-backend\src\services\grid\fones\fonesController.ts

import { Request, Response } from "express";
import { AppDataSource } from "../../../config/db";

import { fonesGridSelect } from "../../utility/fones/fonesGridSelect";
import { mapFonesGridRow } from "../../utility/fones/mapFonesGridRow";

export async function getFonesGrid(req: Request, res: Response) {
  const rows = await AppDataSource.query(fonesGridSelect);

  const result = rows.map(mapFonesGridRow);

  return res.json(result);
}