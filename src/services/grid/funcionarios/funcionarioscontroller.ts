
//C:\repository\proj-full-stack-backend\src\services\grid\funcionarios\funcionarioscontroller.ts

import { Request, Response } from "express";
import { AppDataSource } from "../../../config/db";
import { funcionariosGridSelect } from "../../utility/funcionarios/funcionariosGridSelect";
import { mapFuncionariosGridRow } from "../../utility/funcionarios/mapFuncionariosGridRow";

export async function getFuncionariosGrid(req: Request, res: Response) {
  const rows = await AppDataSource.query(funcionariosGridSelect);

  const result = rows.map(mapFuncionariosGridRow);

  return res.json(result);
}