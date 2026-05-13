
//C:\repository\proj-full-stack-backend\src\services\grid\cidades\cidadesController.ts

import { Request, Response } from "express";
import { AppDataSource } from "../../../config/db";

import { cidadesGridSelect } from "../../utility/cidades/cidadesGridSelect";
import { mapCidadesGridRow } from "../../utility/cidades/mapCidadesGridRow";

export async function getCidadesGrid(req: Request, res: Response) {
  const rows = await AppDataSource.query(cidadesGridSelect);

  const result = rows.map(mapCidadesGridRow);

  return res.json(result);
}