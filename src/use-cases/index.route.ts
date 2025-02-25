import { Router } from 'express';

import { pessoasRoute } from './pessoas';
import { empresasRoute } from './empresas';
import { setoresRoute } from './setores'; 

const indexRoute = Router();

indexRoute.use('/pessoas', pessoasRoute);
indexRoute.use('/empresas', empresasRoute);
indexRoute.use('/setores', setoresRoute);

indexRoute.get('/', (req, res) => {
  return res.status(200).send({success: true}).end()
});


export { indexRoute };
