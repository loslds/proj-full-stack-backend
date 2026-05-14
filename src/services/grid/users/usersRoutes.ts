
// C:\repository\proj-full-stack-backend\src\services\grid\users\usersRoutes.ts

import { Router } from 'express';

import { getUsersGrid } from './usersController';

const usersRoutes = Router();

usersRoutes.get('/', getUsersGrid);

export { usersRoutes };

