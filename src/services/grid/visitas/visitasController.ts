
//C:\repository\proj-full-stack-backend\src\services\grid\visitas\visitasController.ts

import { Request, Response } from "express";
import { AppDataSource } from "../../../config/db";

import { visitasGridSelect } from "../../utility/visitas/visitasGridSelect";
import { mapVisitasGridRow } from "../../utility/visitas/mapVisitasGridRow";

export async function getVisitasGrid(req: Request, res: Response) {
  const rows = await AppDataSource.query(visitasGridSelect);

  const result = rows.map(mapVisitasGridRow);

  return res.json(result);
}