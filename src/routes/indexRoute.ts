 
// src/routes/indexRoute.ts
import { Router } from 'express';
import { systemRoutes } from './systemRoutes';
import { systableRoute } from '../use-cases/systable';
import { syncTablesRoutes } from './syncTablesRoutes'; // nova

import { pessoasRoute } from '../use-cases/pessoa';
import { imagensRoute } from '../use-cases/imagen';
import { empresasRoute } from '../use-cases/empresa';
import { consumidoresRoute } from '../use-cases/consumidor';
import { clientesRoute }from '../use-cases/cliente';
import { fornecedoresRoute }from '../use-cases/fornecedor';
import { funcionariosRoute }from '../use-cases/funcionario';
import { estadosRoute }from '../use-cases/estado';

//import { cidadesRoute }from '../use-cases/cidade';
import { cadastrosRoute }from '../use-cases/cadastro';

import  cepRoutes  from "./cepRoutes"; // rota do CEP numero
import logradouroRoutes from "./logradouroRoutes"; // rota do CEP logradouro

const indexRoute = Router();

indexRoute.use('/systables', systableRoute);
indexRoute.use('/pessoas', pessoasRoute);
indexRoute.use('/imagens', imagensRoute);

indexRoute.use('/empresas', empresasRoute);
indexRoute.use('/consumidores', consumidoresRoute);
indexRoute.use('/clientes', clientesRoute);
indexRoute.use('/fornecedores', fornecedoresRoute);
indexRoute.use('/funcionarios', funcionariosRoute);
indexRoute.use('/estados', estadosRoute);
{/** 

indexRoute.use('/cidades', cidadesRoute);
*/}
indexRoute.use('/cadastros', cadastrosRoute);


// novas rotas
indexRoute.use('/system', systemRoutes);
indexRoute.use('/sync', syncTablesRoutes);
indexRoute.use("/cep", cepRoutes); // /api/cep/12345678
indexRoute.use("/logradouro", logradouroRoutes); // /api/logradouro?uf=SP&cidade=Sao Paulo&rua=Avenida Paulista

indexRoute.get('/', (req, res) => {
  return res.status(200).send({ success: true });
});

export { indexRoute };

