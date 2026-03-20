import { Repository } from 'typeorm';

//C:\repository\proj-full-stack-backend\src\use-cases\funcionario\funcionarios.router.ts
// C:\repository\proj-full-stack-backend\src\use-cases\funcionario\funcionarios.route.ts
import { Router } from 'express';
import { AppDataSource } from '../../config/db';
import { FuncionariosController } from './funcionarios.controller';
import { FuncionariosRepository } from './funcionarios.repository';
import {
  funcionarioscreateValidation,
  funcionariosupdateValidation
} from './funcionarios.validation';

const funcionariosRepository = new FuncionariosRepository(AppDataSource);
const controller = new FuncionariosController(funcionariosRepository);
const funcionariosRoute = Router();

// ==========================================================
// ROTAS FIXAS
// Sempre declarar antes das rotas dinâmicas
// ==========================================================

// GET -> Lista todos os funcionários
funcionariosRoute.get('/', controller.findAllFuncionarios.bind(controller));

// GET -> Pesquisa combinada por id, nome, fantasy, pessoa e empresa
funcionariosRoute.get('/search', controller.searchFuncionariosAll.bind(controller));

// GET -> Pesquisa por nome aproximado
funcionariosRoute.get('/search-nome', controller.searchFuncionariosNome.bind(controller));

// GET -> Pesquisa por fantasy aproximado
funcionariosRoute.get('/search-fantasy', controller.searchFuncionariosFantasy.bind(controller));

// GET -> Busca um funcionário por nome exato
funcionariosRoute.get('/one-nome', controller.findOneFuncionariosNome.bind(controller));

// GET -> Busca todos os funcionários por nome exato
funcionariosRoute.get('/all-nome', controller.findAllFuncionariosNome.bind(controller));

// GET -> Busca um funcionário por fantasy exato
funcionariosRoute.get('/one-fantasy', controller.findOneFuncionariosFantasy.bind(controller));

// GET -> Busca todos os funcionários por fantasy exato
funcionariosRoute.get('/all-fantasy', controller.findAllFuncionariosFantasy.bind(controller));

// GET -> Busca todos os funcionários por pessoa
funcionariosRoute.get('/pessoas/:pessoasId', controller.findAllFuncionariosPessoasId.bind(controller));

// GET -> Busca todos os funcionários por empresa
funcionariosRoute.get('/empresas/:empresasId', controller.findAllFuncionariosEmpresasId.bind(controller));

// GET -> Lista funcionários com detalhes
funcionariosRoute.get('/details', controller.listAllFuncionariosDetails.bind(controller));

// POST -> Cria novo funcionário
funcionariosRoute.post('/', funcionarioscreateValidation, controller.createNewFuncionarios.bind(controller));

// ==========================================================
// ROTAS DINÂMICAS
// ==========================================================

// GET -> Busca funcionário por ID
funcionariosRoute.get('/:funcionariosId', controller.getOneFuncionariosId.bind(controller));

// PATCH -> Atualiza funcionário por ID
funcionariosRoute.patch('/:funcionariosId', funcionariosupdateValidation, controller.updateIdFuncionarios.bind(controller));

// DELETE -> Remove funcionário por ID
funcionariosRoute.delete('/:funcionariosId', controller.removeIdFuncionarios.bind(controller));

export { funcionariosRoute as funcionariosRoutes };


