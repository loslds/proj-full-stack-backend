
//C:\repository\proj-full-stack-backend\src\use-cases\fornecedor\fornecedores.router.ts
// C:\repository\proj-full-stack-backend\src\use-cases\fornecedor\fornecedores.route.ts
import { Router } from 'express';
import { AppDataSource } from '../../config/db';
import { FornecedoresController } from './fornecedores.controller';
import { FornecedoresRepository } from './fornecedores.repository';
import {
  fornecedorescreateValidation,
  fornecedoresupdateValidation
} from './fornecedores.validation';

const fornecedoresRepository = new FornecedoresRepository(AppDataSource);
const controller = new FornecedoresController(fornecedoresRepository);
const fornecedoresRoute = Router();

// ==========================================================
// ROTAS FIXAS
// Sempre declarar antes das rotas dinâmicas
// ==========================================================

// GET -> Lista todos os fornecedores
fornecedoresRoute.get('/', controller.findAllFornecedores.bind(controller));

// GET -> Pesquisa combinada por id, nome, fantasy, pessoa e empresa
fornecedoresRoute.get('/search', controller.searchFornecedoresAll.bind(controller));

// GET -> Pesquisa por nome aproximado
fornecedoresRoute.get('/search-nome', controller.searchFornecedoresNome.bind(controller));

// GET -> Pesquisa por fantasy aproximado
fornecedoresRoute.get('/search-fantasy', controller.searchFornecedoresFantasy.bind(controller));

// GET -> Busca um fornecedor por nome exato
fornecedoresRoute.get('/one-nome', controller.findOneFornecedoresNome.bind(controller));

// GET -> Busca todos os fornecedores por nome exato
fornecedoresRoute.get('/all-nome', controller.findAllFornecedoresNome.bind(controller));

// GET -> Busca um fornecedor por fantasy exato
fornecedoresRoute.get('/one-fantasy', controller.findOneFornecedoresFantasy.bind(controller));

// GET -> Busca todos os fornecedores por fantasy exato
fornecedoresRoute.get('/all-fantasy', controller.findAllFornecedoresFantasy.bind(controller));

// GET -> Busca todos os fornecedores por pessoa
fornecedoresRoute.get('/pessoas/:pessoasId', controller.findAllFornecedoresPessoasId.bind(controller));

// GET -> Busca todos os fornecedores por empresa
fornecedoresRoute.get('/empresas/:empresasId', controller.findAllFornecedoresEmpresasId.bind(controller));

// GET -> Lista fornecedores com detalhes
fornecedoresRoute.get('/details', controller.listAllFornecedoresDetails.bind(controller));

// POST -> Cria novo fornecedor
fornecedoresRoute.post('/', fornecedorescreateValidation, controller.createNewFornecedores.bind(controller));

// ==========================================================
// ROTAS DINÂMICAS
// ==========================================================

// GET -> Busca fornecedor por ID
fornecedoresRoute.get('/:fornecedoresId', controller.getOneFornecedoresId.bind(controller));

// PATCH -> Atualiza fornecedor por ID
fornecedoresRoute.patch('/:fornecedoresId', fornecedoresupdateValidation, controller.updateIdFornecedores.bind(controller));

// DELETE -> Remove fornecedor por ID
fornecedoresRoute.delete('/:fornecedoresId', controller.removeIdFornecedores.bind(controller));

export { fornecedoresRoute as fornecedoresRoutes };



