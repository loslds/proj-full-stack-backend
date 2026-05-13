
//C:\repository\proj-full-stack-backend\src\services\utility\estados\estadosController.ts

import { Request, Response } from "express";
import { AppDataSource } from "../../../config/db";
import { estadosGridSelect } from "./estadosGridSelect";
import { mapEstadosGridRow } from "./mapEstadosGridRow";

export async function getEstadosGrid(req: Request, res: Response) {
  const rows = await AppDataSource.query(estadosGridSelect);

  const result = rows.map(mapEstadosGridRow);

  return res.json(result);
}