
//C:\repository\proj-full-stack-backend\src\services\grid\acoes\acoesController.ts

import { Request, Response } from "express";
import { AppDataSource } from "../../../config/db";

import { acoesGridSelect } from "../../utility/acoes/acoesGridSelect";
import { mapAcoesGridRow } from "../../utility/acoes/mapAcoesGridRow";

export async function getAcoesGrid(req: Request, res: Response) {
  const rows = await AppDataSource.query(acoesGridSelect);

  const result = rows.map(mapAcoesGridRow);

  return res.json(result);
}