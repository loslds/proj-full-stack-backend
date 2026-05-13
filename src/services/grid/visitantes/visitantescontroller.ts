
//C:\repository\proj-full-stack-backend\src\services\grid\visitantes\visitantescontroller.ts

import { Request, Response } from "express";
import { AppDataSource } from "../../../config/db";
import { visitantesGridSelect } from "../../utility/visitantes/visitantesGridSelect";
import { mapVisitantesGridRow } from "../../utility/visitantes/mapVisitantesGridRow";

export async function getVisitantesGrid(req: Request, res: Response) {
  const rows = await AppDataSource.query(visitantesGridSelect);

  const result = rows.map(mapVisitantesGridRow);

  return res.json(result);
}