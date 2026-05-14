
// C:\repository\proj-full-stack-backend\src\services\grid\logins\loginsController.ts

import { Request, Response } from 'express';

import { AppDataSource } from '../../../config/db';

import { loginsGridSelect } from '../../utility/logins/loginsGridSelect';
import { mapLoginsGridRow } from '../../utility/logins/mapLoginsGridRow';

export async function getLoginsGrid(
  req: Request,
  res: Response
) {
  const rows = await AppDataSource.query(loginsGridSelect);

  const result = rows.map(mapLoginsGridRow);

  return res.json(result);
}

