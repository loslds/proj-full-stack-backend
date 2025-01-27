import { Router } from 'express';

import { pessoasRoute } from './pessoas/pessoas.route';
import { empresasRoute } from './empresas/empresas.route';


import { usersRoute } from './users/users.route';



import { moduloRoute } from './modulo/modulo.route';

const indexRoute = Router();

indexRoute.use('/pessoas', pessoasRoute);
indexRoute.use('/empresas', empresasRoute);


indexRoute.use('/users', usersRoute);
indexRoute.use('/modulo', moduloRoute);

export { indexRoute };
