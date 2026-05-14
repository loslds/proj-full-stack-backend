
// C:\repository\proj-full-stack-backend\src\services\grid\chaves\chavesController.ts

import { Request, Response } from 'express';

import { AppDataSource } from '../../../config/db';

import { chavesGridSelect } from '../../utility/chaves/chavesGridSelect';
import { mapChavesGridRow } from '../../utility/chaves/mapChavesGridRow';

export async function getChavesGrid(
  req: Request,
  res: Response
) {
  const rows = await AppDataSource.query(chavesGridSelect);

  const result = rows.map(mapChavesGridRow);

  return res.json(result);
}

