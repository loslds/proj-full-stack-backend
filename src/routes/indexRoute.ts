 
// src/routes/indexRoute.ts
import { Router } from 'express';
import { systableRoute } from '../use-cases/systable';
import { pessoasRoute } from '../use-cases/pessoa';
import { empresasRoute } from '../use-cases/empresa';
import { systemRoutes } from './systemRoutes';      // nova
import { syncTablesRoutes } from './syncTablesRoutes'; // nova

const indexRoute = Router();

indexRoute.use('/systable', systableRoute);
indexRoute.use('/pessoas', pessoasRoute);
indexRoute.use('/empresas', empresasRoute);

// novas rotas
indexRoute.use('/system', systemRoutes);
indexRoute.use('/sync', syncTablesRoutes);

indexRoute.get('/', (req, res) => {
  return res.status(200).send({ success: true });
});

export { indexRoute };
