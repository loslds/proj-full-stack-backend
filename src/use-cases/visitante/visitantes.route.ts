  
// C:\repository\proj-full-stack-backend\src\use-cases\visitante\visitantes.route.ts
import { Router } from 'express';
import { AppDataSource } from '../../config/db';
import { VisitantesController } from './visitantes.controller';
import { VisitantesRepository } from './visitantes.repository';
import {
  visitantescreateValidation,
  visitantesupdateValidation
} from './visitantes.validation';

const visitantesRepository = new VisitantesRepository(AppDataSource);
const controller = new VisitantesController(visitantesRepository);
const visitantesRoute = Router();

// ==========================================================
// ROTAS FIXAS
// Sempre declarar antes das rotas dinâmicas
// ==========================================================

// GET -> Lista todos os visitantes
visitantesRoute.get('/', controller.findAllVisitantes.bind(controller));

// GET -> Pesquisa combinada por id, nome, fantasy, pessoa e empresa
visitantesRoute.get('/search', controller.searchVisitantesAll.bind(controller));

// GET -> Pesquisa por nome aproximado
visitantesRoute.get('/search-nome', controller.searchVisitantesNome.bind(controller));

// GET -> Pesquisa por fantasy aproximado
visitantesRoute.get('/search-fantasy', controller.searchVisitantesFantasy.bind(controller));

// GET -> Busca um visitante por nome exato
visitantesRoute.get('/one-nome', controller.findOneVisitantesNome.bind(controller));

// GET -> Busca todos os visitantes por nome exato
visitantesRoute.get('/all-nome', controller.findAllVisitantesNome.bind(controller));

// GET -> Busca um visitante por fantasy exato
visitantesRoute.get('/one-fantasy', controller.findOneVisitantesFantasy.bind(controller));

// GET -> Busca todos os visitantes por fantasy exato
visitantesRoute.get('/all-fantasy', controller.findAllVisitantesFantasy.bind(controller));

// GET -> Busca todos os visitantes por pessoa
visitantesRoute.get('/pessoas/:pessoasId', controller.findAllVisitantesPessoasId.bind(controller));

// GET -> Busca todos os visitantes por empresa
visitantesRoute.get('/empresas/:empresasId', controller.findAllVisitantesEmpresasId.bind(controller));

// GET -> Lista visitantes com detalhes
visitantesRoute.get('/details', controller.listAllVisitantesDetails.bind(controller));

// POST -> Cria novo visitante
visitantesRoute.post('/', visitantescreateValidation, controller.createNewVisitantes.bind(controller));

// ==========================================================
// ROTAS DINÂMICAS
// ==========================================================

// GET -> Busca visitante por ID
visitantesRoute.get('/:visitantesId', controller.getOneVisitantesId.bind(controller));

// PATCH -> Atualiza visitante por ID
visitantesRoute.patch('/:visitantesId', visitantesupdateValidation, controller.updateIdVisitantes.bind(controller));

// DELETE -> Remove visitante por ID
visitantesRoute.delete('/:visitantesId', controller.removeIdVisitantes.bind(controller));

export { visitantesRoute as visitantesRoutes };


 

