
//C:\repository\proj-full-stack-backend\src\services\grid\perguntas\perguntasController.ts

import { Request, Response } from "express";
import { AppDataSource } from "../../../config/db";

import { perguntasGridSelect } from "../../utility/perguntas/perguntasGridSelect";
import { mapPerguntasGridRow } from "../../utility/perguntas/mapPerguntasGridRow";

export async function getPerguntasGrid(req: Request, res: Response) {
  const rows = await AppDataSource.query(perguntasGridSelect);

  const result = rows.map(mapPerguntasGridRow);

  return res.json(result);
}
