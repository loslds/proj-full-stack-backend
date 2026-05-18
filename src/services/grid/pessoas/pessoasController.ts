

//C:\repository\proj-full-stack-backend\src\services\grid\controller\pessoasController.ts

import { Request, Response } from "express";
import { AppDataSource } from "../../../config/db";
import { pessoasGridSelect } from '../../utility/pessoas/pessoasGridSelect';
import { mapPessoasGridRow } from "../../utility/pessoas/mapPessoasGridRow";

export async function getPessoasGrid(req: Request, res: Response) {
  const rows = await AppDataSource.query(pessoasGridSelect);

  const result = rows.map(mapPessoasGridRow);

  return res.json(result);
}