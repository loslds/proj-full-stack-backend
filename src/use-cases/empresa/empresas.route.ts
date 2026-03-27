
/// C:\repository\proj-full-stack-backend\src\use-cases\empresa\empresas.route.ts

import { Router } from 'express';
import { AppDataSource } from '../../config/db';
import { EmpresasController } from './empresas.controller';
import { EmpresasRepository } from './empresas.repository';
import {
  empresascreateValidation,
  empresasupdateValidation
} from './empresas.validation';

const empresasRepository = new EmpresasRepository(AppDataSource);
const controller = new EmpresasController(empresasRepository);
const empresasRoute = Router();

// ==========================================================
// ROTAS FIXAS
// Sempre declarar antes das rotas dinâmicas
// ==========================================================

// GET -> Lista todas as empresas
empresasRoute.get('/', controller.findAllEmpresas.bind(controller));

// GET -> Pesquisa combinada por id, nome, fantasy e pessoa
empresasRoute.get('/search', controller.searchEmpresasAll.bind(controller));

// GET -> Pesquisa por nome aproximado
empresasRoute.get('/search-nome', controller.searchEmpresasNome.bind(controller));

// GET -> Pesquisa por fantasy aproximado
empresasRoute.get('/search-fantasy', controller.searchEmpresasFantasy.bind(controller));

// GET -> Busca uma empresa por nome exato
empresasRoute.get('/one-nome', controller.findOneEmpresasNome.bind(controller));

// GET -> Busca todas as empresas por nome exato
empresasRoute.get('/all-nome', controller.findAllEmpresasNome.bind(controller));

// GET -> Busca uma empresa por fantasy exato
empresasRoute.get('/one-fantasy', controller.findOneEmpresasFantasy.bind(controller));

// GET -> Busca todas as empresas por fantasy exato
empresasRoute.get('/all-fantasy', controller.findAllEmpresasFantasy.bind(controller));

// GET -> Busca todas as empresas por pessoa
empresasRoute.get('/pessoas/:pessoasId', controller.findAllEmpresasPessoasId.bind(controller));

// GET -> Lista empresas com detalhes
empresasRoute.get('/details', controller.listAllEmpresasDetails.bind(controller));

// POST -> Cria nova empresa
empresasRoute.post(
  '/',
  empresascreateValidation,
  controller.createNewEmpresas.bind(controller)
);

// ==========================================================
// ROTAS DINÂMICAS
// ==========================================================

// GET -> Busca empresa por ID
empresasRoute.get('/:empresasId', controller.getOneEmpresasId.bind(controller));

// PATCH -> Atualiza empresa por ID
empresasRoute.patch(
  '/:empresasId',
  empresasupdateValidation,
  controller.updateIdEmpresas.bind(controller)
);

// DELETE -> Remove empresa por ID
empresasRoute.delete('/:empresasId', controller.removeIdEmpresas.bind(controller));

export { empresasRoute as empresasRoutes };


