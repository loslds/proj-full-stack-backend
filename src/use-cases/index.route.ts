import { Router } from 'express';

import { userRoute } from './user/user.route';

import { pessoaRoute } from './pessoa/pessoa.route';

const indexRoute = Router();

indexRoute.use('/user', userRoute);

indexRoute.use('/pessoa', pessoaRoute);

export { indexRoute };
