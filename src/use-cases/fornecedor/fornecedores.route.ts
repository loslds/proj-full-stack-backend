
// /use-cases/consumidor/consumidores.route.ts
import { Router } from 'express';
import { FornecedoresController } from './fornecedores.controller';
import { FornecedoresRepository } from './fornecedores.repository';
import { dbSource } from '../../database';
import { fornecedorescreateValidation, fornecedoresupdateValidation } from './fornecedores.validation';
import { ParsedQs } from 'qs';

interface SearchQuery extends ParsedQs {
  id?: string;
  nome?: string;
  fantasy?: string;
}
const fornecedoresRepository = new FornecedoresRepository(dbSource);
const controller = new FornecedoresController(fornecedoresRepository);

const fornecedoresRoute = Router();

// Tipagem para a rota de busca
interface SearchQuery {
  id?: string;
  nome?: string;
  fantasy?: string;
}

fornecedoresRoute.get('/', controller.findAllFornecedores.bind(controller));
fornecedoresRoute.post('/', fornecedorescreateValidation, controller.createNewFornecedores.bind(controller));
fornecedoresRoute.get('/:fornecedoresId', controller.getOneFornecedoresId.bind(controller));
fornecedoresRoute.patch('/:fornecedoresId', fornecedoresupdateValidation, controller.updateIdFornecedores.bind(controller));
fornecedoresRoute.delete('/:fornecedoresId', controller.removeIdFornecedores.bind(controller));
fornecedoresRoute.get('/by-one-name', controller.findOneFornecedoresNome.bind(controller));
fornecedoresRoute.get('/by-one-fantasy', controller.findOneFornecedoresFantasy.bind(controller));
fornecedoresRoute.get('/by-pessoas/:pessoasId', controller.findAllFornecedoresPessoasId.bind(controller));
fornecedoresRoute.get('/by-imagens/:imagensId', controller.findAllFornecedoresImagensId.bind(controller));
fornecedoresRoute.get('/search', controller.searchByFornecedores.bind(controller));
fornecedoresRoute.get('/details', controller.findAllFornecedoresByDetails.bind(controller));

export { fornecedoresRoute as fornecedoresRoutes };
