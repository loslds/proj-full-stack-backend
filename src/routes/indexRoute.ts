 
// src/routes/indexRoute.ts
import { Router } from 'express';
import { systemRoutes } from './systemRoutes';
import { systableRoute } from '../use-cases/systable';
import { syncTablesRoutes } from './syncTablesRoutes'; // nova

import { pessoasRoutes } from '../use-cases/pessoa';
import { imagensRoutes } from '../use-cases/imagen';
import { empresasRoutes } from '../use-cases/empresa';
import { estadosRoutes } from '../use-cases/estado';
import { cidadesRoutes } from '../use-cases/cidade';

import { consumidoresRoutes } from '../use-cases/consumidor';
import { clientesRoutes } from '../use-cases/cliente';
import { fornecedoresRoutes } from '../use-cases/fornecedor';
import { funcionariosRoutes } from '../use-cases/funcionario';

//import { cadastrosRoutes } from '../use-cases/cadastro';

import  cepRoutes  from "./cepRoutes"; // rota do CEP numero
import logradouroRoutes from "./logradouroRoutes"; // rota do CEP logradouro

const indexRoute = Router();

indexRoute.use('/systables', systableRoute);
indexRoute.use('/pessoas', pessoasRoutes);
indexRoute.use('/imagens', imagensRoutes);
indexRoute.use('/empresas', empresasRoutes);
indexRoute.use('/estados', estadosRoutes);
indexRoute.use('/cidades', cidadesRoutes);

indexRoute.use('/consumidores', consumidoresRoutes);
indexRoute.use('/clientes', clientesRoutes);
indexRoute.use('/fornecedores', fornecedoresRoutes);
indexRoute.use('/funcionarios', funcionariosRoutes);

// indexRoute.use('/cadastros', cadastrosRoutes);


// novas rotas
indexRoute.use('/system', systemRoutes);
indexRoute.use('/sync', syncTablesRoutes);
indexRoute.use("/cep", cepRoutes); // /api/cep/12345678
indexRoute.use("/logradouro", logradouroRoutes); // /api/logradouro?uf=SP&cidade=Sao Paulo&rua=Avenida Paulista

indexRoute.get('/', (req, res) => {
  return res.status(200).send({ success: true });
});

export { indexRoute };

