
//C:\repository\proj-full-stack-backend\src\services\grid\cargos\cargosController.ts

import { Request, Response } from "express";
import { AppDataSource } from "../../../config/db";

import { cargosGridSelect } from "../../utility/cargos/cargosGridSelect";
import { mapCargosGridRow } from "../../utility/cargos/mapCargosGridRow";

export async function getCargosGrid(req: Request, res: Response) {
  const rows = await AppDataSource.query(cargosGridSelect);

  const result = rows.map(mapCargosGridRow);

  return res.json(result);
}