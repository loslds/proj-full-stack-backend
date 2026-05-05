
// C:\repository\proj-full-stack-backend\src\services\controller\cadastrosController.ts

import { Request, Response } from "express";
import { AppDataSource } from "../../config/db";
import { cadastroGridSelect } from "../utility/cadastros/cadastroGridSelect";
import { mapCadastroGridRow } from "../utility/cadastros/mapCadastroGridRow";

export async function getCadastros(req: Request, res: Response) {
  const rows = await AppDataSource.query(cadastroGridSelect);

  const result = rows.map(mapCadastroGridRow);

  return res.json(result);
}