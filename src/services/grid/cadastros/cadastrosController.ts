
// C:\repository\proj-full-stack-backend\src\services\controller\cadastrosController.ts

import { Request, Response } from "express";
import { AppDataSource } from "../../../config/db";
import { cadastrosGridSelect } from "../../utility/cadastros/cadastrosGridSelect";
import { mapCadastrosGridRow } from "../../utility/cadastros/mapCadastrosGridRow";

export async function getCadastros(req: Request, res: Response) {
  const rows = await AppDataSource.query(cadastrosGridSelect);

  const result = rows.map(mapCadastrosGridRow);

  return res.json(result);
}