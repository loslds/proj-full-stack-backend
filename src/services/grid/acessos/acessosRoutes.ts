
// C:\repository\proj-full-stack-backend\src\services\grid\acessos\acessosRoutes.ts

import { Router } from 'express';

import { getAcessosGrid } from './acessosController';

const acessosRoutes = Router();

acessosRoutes.get('/', getAcessosGrid);

export { acessosRoutes };

