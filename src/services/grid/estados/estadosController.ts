
//C:\repository\proj-full-stack-backend\src\services\grid\estados\estadosController.ts

import { Request, Response } from "express";
import { AppDataSource } from "../../../config/db";

import { estadosGridSelect } from "../../utility/estados/estadosGridSelect";
import { mapEstadosGridRow } from "../../utility/estados/mapEstadosGridRow";

export async function getEstadosGrid(req: Request, res: Response) {
  const rows = await AppDataSource.query(estadosGridSelect);

  const result = rows.map(mapEstadosGridRow);

  return res.json(result);
}