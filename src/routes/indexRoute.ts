 
// src/routes/indexRoute.ts
import { Router } from 'express';
import { systemRoutes } from './systemRoutes';
import { systableRoute } from '../use-cases/systable';
import { imagensRoute } from '../use-cases/imagen';
import { pessoasRoute } from '../use-cases/pessoa';
import { empresasRoute } from '../use-cases/empresa';
import { syncTablesRoutes } from './syncTablesRoutes'; // nova

import  cepRoutes  from "./cepRoutes"; // rota do CEP numero
import logradouroRoutes from "./logradouroRoutes"; // rota do CEP logradouro

const indexRoute = Router();

indexRoute.use('/systables', systableRoute);
indexRoute.use('/pessoas', pessoasRoute);
indexRoute.use('/imagens', imagensRoute);

indexRoute.use('/empresas', empresasRoute);

// novas rotas
indexRoute.use('/system', systemRoutes);
indexRoute.use('/sync', syncTablesRoutes);
indexRoute.use("/cep", cepRoutes); // /api/cep/12345678
indexRoute.use("/logradouro", logradouroRoutes); // /api/logradouro?uf=SP&cidade=Sao Paulo&rua=Avenida Paulista

indexRoute.get('/', (req, res) => {
  return res.status(200).send({ success: true });
});

export { indexRoute };

