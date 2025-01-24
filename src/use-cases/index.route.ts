import { Router } from 'express';

import { userRoute } from './users/user.route';

import { pessoaRoute } from './pessoa/pessoa.route';

import { moduloRoute } from './modulo/modulo.route';

const indexRoute = Router();

indexRoute.use('/user', userRoute);

indexRoute.use('/pessoa', pessoaRoute);

indexRoute.use('/modulo', moduloRoute);


export { indexRoute };
