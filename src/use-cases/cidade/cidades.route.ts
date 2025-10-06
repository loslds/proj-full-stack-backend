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
cidadesRoute.patch('/:cidadesId', cidadesupdateValidation, controller.updateIdCidades.bind(controller));

// 3️⃣ DELETE - Remove cidade por ID
cidadesRoute.delete('/:cidadesId', controller.removeCidadesId.bind(controller));

// 4️⃣ GET - Lista todas as cidades (com opção de filtro ativo e ordenação)
cidadesRoute.get('/', controller.findAllCidades.bind(controller));

// 5️⃣ GET - Busca cidade por ID
cidadesRoute.get('/id/:cidadesId', controller.getOneIdCidades.bind(controller));

// 6️⃣ GET - Busca cidade por nome exato
cidadesRoute.get('/nome', controller.findOneNomeCidades.bind(controller));

// 7️⃣ GET - Busca cidade por sigla
cidadesRoute.get('/sigla', controller.findOneCidadesBySigla.bind(controller));

// 8️⃣ GET - Busca por nome ou estado com paginação (100 por página)
cidadesRoute.get('/search', controller.searchByNomeOuEstadoPaginado.bind(controller));

// 9️⃣ GET - Busca todas as cidades de um único estado (por ID ou nome/UF)
cidadesRoute.get('/estado', controller.findCidadesByEstado.bind(controller));

export { cidadesRoute as cidadesRoutes };
