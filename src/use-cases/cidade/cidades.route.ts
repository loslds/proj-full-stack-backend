 
// C:\repository\proj-full-stack-backend\src\use-cases\cidade\cidades.route.ts
import { Router } from 'express';
import { dbSource } from '../../database';
import { CidadesController } from './cidades.controller';
import { CidadesRepository } from './cidades.repository';
import { cidadescreateValidation, cidadesupdateValidation } from './cidades.validation';

const cidadesRepository = new CidadesRepository(dbSource);
const controller = new CidadesController(cidadesRepository);

const cidadesRoute = Router();

/** ROTAS CIDADES */

// 1️⃣ POST - Cria nova cidade
cidadesRoute.post('/', cidadescreateValidation, controller.createNewCidades.bind(controller));

// 2️⃣ PATCH - Atualiza cidade por ID
cidadesRoute.patch('/:Id', cidadesupdateValidation, controller.updateIdCidades.bind(controller));

// 3️⃣ DELETE - Remove cidade por ID
cidadesRoute.delete('/:Id', controller.removeCidadesId.bind(controller));

// 4️⃣ GET - Lista todas as cidades (com opção de filtro ativo e ordenação)
cidadesRoute.get('/', controller.findAllCidades.bind(controller));

// 5️⃣ GET - Busca cidade por ID
cidadesRoute.get('/id/:cidadesId', controller.getOneIdCidades.bind(controller));

// 6️⃣ GET - Busca cidade por nome exato
cidadesRoute.get('/nome', controller.findOneNomeCidades.bind(controller));

// 7️⃣ GET - Busca cidade por uf
cidadesRoute.get('/uf', controller.findOneCidadesByUf.bind(controller));

// 8️⃣ GET - Busca por nome ou estado com paginação (100 por página)
cidadesRoute.get('/search', controller.searchByNomeOuEstadoPaginado.bind(controller));

// 9️⃣ GET - Lista cidades de um estado pelo ID
cidadesRoute.get('/estado/:id_estado', controller.listAllCidadesByIdEstado.bind(controller));

// 🔟 GET - Lista todas cidades + estado (detalhes)
  cidadesRoute.get('/details', controller.listAllCidadesDetails.bind(controller));

export { cidadesRoute as cidadesRoutes };

