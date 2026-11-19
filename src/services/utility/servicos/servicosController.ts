
//C:\repository\proj-full-stack-backend\src\services\utility\pessoas\pessoasController.ts

import { Request, Response } from "express";
import { AppDataSource } from "../../../config/db";
import { servicosGridSelect } from "./servicosGridSelect";
import { mapServicosGridRow } from "./mapServicosGridRow";

export async function getServicosGrid(req: Request, res: Response) {
  const rows = await AppDataSource.query(servicosGridSelect);

  const result = rows.map(mapServicosGridRow);

  return res.json(result);
}