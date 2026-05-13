
//C:\repository\proj-full-stack-backend\src\services\grid\consumidores\consumidorescontroller.ts

import { Request, Response } from "express";
import { AppDataSource } from "../../../config/db";
import { consumidoresGridSelect } from "../../utility/consumidores/consumidoresGridSelect";
import { mapConsumidoresGridRow } from "../../utility/consumidores/mapConsumidoresGridRow";

export async function getConsumidoresGrid(req: Request, res: Response) {
  const rows = await AppDataSource.query(consumidoresGridSelect);

  const result = rows.map(mapConsumidoresGridRow);

  return res.json(result);
}