import { Router } from 'express';

import { pessoasRoute } from './pessoas/pessoas.route';
//import { empresasRoute } from './empresas/empresas.route';


//import { usersRoute } from './users/users.route';



//import { moduloRoute } from './modulo/modulo.route';

const indexRoute = Router();

indexRoute.use('/pessoas', pessoasRoute);
//indexRoute.use('/empresas', empresasRoute);


//indexRoute.use('/users', usersRoute);
//indexRoute.use('/modulo', moduloRoute);

indexRoute.get('/', (req, res) => {
  return res.status(200).send({success: true}).end()
});


export { indexRoute };
