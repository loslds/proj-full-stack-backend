
// C:\repository\proj-full-stack-backend\src\services\grid\pergsresps\pergsrespsController.ts

import { Request, Response } from 'express';

import { AppDataSource } from '../../../config/db';

import { pergsrespsGridSelect } from '../../utility/pergsresps/pergsrespsGridSelect';
import { mapPergsrespsGridRow } from '../../utility/pergsresps/mapPergsrespsGridRow';

export async function getPergsrespsGrid(
  req: Request,
  res: Response
) {
  const rows = await AppDataSource.query(pergsrespsGridSelect);

  const result = rows.map(mapPergsrespsGridRow);

  return res.json(result);
}

