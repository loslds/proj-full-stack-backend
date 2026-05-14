
// C:\repository\proj-full-stack-backend\src\services\grid\acessos\acessosController.ts

import { Request, Response } from 'express';

import { AppDataSource } from '../../../config/db';

import { acessosGridSelect } from '../../utility/acessos/acessosGridSelect';
import { mapAcessosGridRow } from '../../utility/acessos/mapAcessosGridRow';

export async function getAcessosGrid(
  req: Request,
  res: Response
) {
  const rows = await AppDataSource.query(acessosGridSelect);

  const result = rows.map(mapAcessosGridRow);

  return res.json(result);
}

