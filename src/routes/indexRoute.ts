 
// src/routes/indexRoute.ts
import { Router } from 'express';
import { systableRoute } from '../use-cases/systable';
import { pessoasRoute } from '../use-cases/pessoa';
import { empresasRoute } from '../use-cases/empresa';

const indexRoute = Router();

// Suas rotas existentes

indexRoute.use('/systable', systableRoute);
indexRoute.use('/pessoas', pessoasRoute);
indexRoute.use('/empresas', empresasRoute);

indexRoute.get('/', (req, res) => {
  return res.status(200).send({ success: true });
});

export { indexRoute };


