
// C:\repository\proj-full-stack-backend\src\services\grid\users\usersController.ts

import { Request, Response } from 'express';

import { AppDataSource } from '../../../config/db';

import { usersGridSelect } from '../../utility/users/usersGridSelect';
import { mapUsersGridRow } from '../../utility/users/mapUsersGridRow';

export async function getUsersGrid(
  req: Request,
  res: Response
) {
  const rows = await AppDataSource.query(usersGridSelect);

  const result = rows.map(mapUsersGridRow);

  return res.json(result);
}

