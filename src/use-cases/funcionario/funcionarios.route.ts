// C:\repository\proj-full-stack-backend\src\use-cases\funcionario\funcionarios.route.ts
import { Router } from 'express';
import { FuncionariosController } from './funcionarios.controller';
import { FuncionariosRepository } from './funcionarios.repository';
import { dbSource } from '../../database';
import { funcionarioscreateValidation, funcionariosupdateValidation } from './funcionarios.validation';
import { ParsedQs } from 'qs';

interface SearchQuery extends ParsedQs {
  id?: string;
  nome?: string;
  fantasy?: string;
}
const funcionariosRepository = new FuncionariosRepository(dbSource);
const controller = new FuncionariosController(funcionariosRepository);
const funcionariosRoute = Router();

// Tipagem para a rota de busca
interface SearchQuery {
  id?: string;
  nome?: string;
  fantasy?: string;
}

funcionariosRoute.get('/', controller.findAllFuncionarios.bind(controller));
funcionariosRoute.post('/', funcionarioscreateValidation, controller.createNewFuncionarios.bind(controller));
funcionariosRoute.get('/:funcionariosId', controller.getOneFuncionariosId.bind(controller));
funcionariosRoute.patch('/:funcionariosId', funcionariosupdateValidation, controller.updateIdFuncionarios.bind(controller));
funcionariosRoute.delete('/:funcionariosId', controller.removeIdFuncionarios.bind(controller));
funcionariosRoute.get('/by-one-name', controller.findOneFuncionariosNome.bind(controller));
funcionariosRoute.get('/by-one-fantasy', controller.findOneFuncionariosFantasy.bind(controller));
funcionariosRoute.get('/by-empresas/:empresasId', controller.findAllFuncionariosEmpresasId.bind(controller));
funcionariosRoute.get('/by-imagens/:imagensId', controller.findAllFuncionariosImagensId.bind(controller));
funcionariosRoute.get('/search', controller.searchFuncionarios.bind(controller));
funcionariosRoute.get('/details', controller.findAllFuncionariosByDetails.bind(controller));

export { funcionariosRoute, funcionariosRepository };
