
//C:\repository\proj-full-stack-backend\src\services\grid\modulos\modulosController.ts

import { Request, Response } from "express";
import { AppDataSource } from "../../../config/db";

import { modulosGridSelect } from "../../utility/modulos/modulosGridSelect";
import { mapModulosGridRow } from "../../utility/modulos/mapModulosGridRow";

export async function getModulosGrid(req: Request, res: Response) {
  const rows = await AppDataSource.query(modulosGridSelect);

  const result = rows.map(mapModulosGridRow);

  return res.json(result);
}