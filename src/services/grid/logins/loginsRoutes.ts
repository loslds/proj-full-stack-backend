
// C:\repository\proj-full-stack-backend\src\services\grid\logins\loginsRoutes.ts

import { Router } from 'express';

import { getLoginsGrid } from './loginsController';

const loginsRoutes = Router();

loginsRoutes.get('/', getLoginsGrid);

export { loginsRoutes };

