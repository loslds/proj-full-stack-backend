
// C:\repository\proj-full-stack-backend\src\services\grid\pergsresps\pergsrespsRoutes.ts

import { Router } from 'express';

import { getPergsrespsGrid } from './pergsrespsController';

const pergsrespsRoutes = Router();

pergsrespsRoutes.get('/', getPergsrespsGrid);

export { pergsrespsRoutes };

