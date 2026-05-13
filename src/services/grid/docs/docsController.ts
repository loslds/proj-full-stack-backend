
//C:\repository\proj-full-stack-backend\src\services\grid\docs\docsController.ts

import { Request, Response } from "express";
import { AppDataSource } from "../../../config/db";

import { docsGridSelect } from "../../utility/docs/docsGridSelect";
import { mapDocsGridRow } from "../../utility/docs/mapDocsGridRow";

export async function getDocsGrid(req: Request, res: Response) {
  const rows = await AppDataSource.query(docsGridSelect);

  const result = rows.map(mapDocsGridRow);

  return res.json(result);
}