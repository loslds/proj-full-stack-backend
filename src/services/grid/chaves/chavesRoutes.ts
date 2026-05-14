
// C:\repository\proj-full-stack-backend\src\services\grid\chaves\chavesRoutes.ts

import { Router } from 'express';

import { getChavesGrid } from './chavesController';

const chavesRoutes = Router();

chavesRoutes.get('/', getChavesGrid);

export { chavesRoutes };

