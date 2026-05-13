
//C:\repository\proj-full-stack-backend\src\services\grid\imagens\imagensController.ts

import { Request, Response } from "express";
import { AppDataSource } from "../../../config/db";

import { imagensGridSelect } from "../../utility/imagens/imagensGridSelect";
import { mapImagensGridRow } from "../../utility/imagens/mapImagensGridRow";

export async function getImagensGrid(req: Request, res: Response) {
  const rows = await AppDataSource.query(imagensGridSelect);

  const result = rows.map(mapImagensGridRow);

  return res.json(result);
}