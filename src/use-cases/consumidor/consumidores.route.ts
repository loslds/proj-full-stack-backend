
//C:\repository\proj-full-stack-backend\src\use-cases\consumidor\consumidores.router.ts
// C:\repository\proj-full-stack-backend\src\use-cases\consumidor\consumidores.route.ts
import { Router } from 'express';
import { AppDataSource } from '../../config/db';
import { ConsumidoresController } from './consumidores.controller';
import { ConsumidoresRepository } from './consumidores.repository';
import {
  consumidorescreateValidation,
  consumidoresupdateValidation
} from './consumidores.validation';

const consumidoresRepository = new ConsumidoresRepository(AppDataSource);
const controller = new ConsumidoresController(consumidoresRepository);
const consumidoresRoute = Router();

// ==========================================================
// ROTAS FIXAS
// Sempre declarar antes das rotas dinâmicas
// ==========================================================

// GET -> Lista todos os consumidores
consumidoresRoute.get('/', controller.findAllConsumidores.bind(controller));

// GET -> Pesquisa combinada por id, nome, fantasy, pessoa e empresa
consumidoresRoute.get('/search', controller.searchConsumidoresAll.bind(controller));

// GET -> Pesquisa por nome aproximado
consumidoresRoute.get('/search-nome', controller.searchConsumidoresNome.bind(controller));

// GET -> Pesquisa por fantasy aproximado
consumidoresRoute.get('/search-fantasy', controller.searchConsumidoresFantasy.bind(controller));

// GET -> Busca um consumidor por nome exato
consumidoresRoute.get('/one-nome', controller.findOneConsumidoresNome.bind(controller));

// GET -> Busca todos os consumidores por nome exato
consumidoresRoute.get('/all-nome', controller.findAllConsumidoresNome.bind(controller));

// GET -> Busca um consumidor por fantasy exato
consumidoresRoute.get('/one-fantasy', controller.findOneConsumidoresFantasy.bind(controller));

// GET -> Busca todos os consumidores por fantasy exato
consumidoresRoute.get('/all-fantasy', controller.findAllConsumidoresFantasy.bind(controller));

// GET -> Busca todos os consumidores por pessoa
consumidoresRoute.get('/pessoas/:pessoasId', controller.findAllConsumidoresPessoasId.bind(controller));

// GET -> Busca todos os consumidores por empresa
consumidoresRoute.get('/empresas/:empresasId', controller.findAllConsumidoresEmpresasId.bind(controller));

// GET -> Lista consumidores com detalhes
consumidoresRoute.get('/details', controller.listAllConsumidoresDetails.bind(controller));

// POST -> Cria novo consumidor
consumidoresRoute.post('/', consumidorescreateValidation, controller.createNewConsumidores.bind(controller));

// ==========================================================
// ROTAS DINÂMICAS
// ==========================================================

// GET -> Busca consumidor por ID
consumidoresRoute.get('/:consumidoresId', controller.getOneConsumidoresId.bind(controller));

// PATCH -> Atualiza consumidor por ID
consumidoresRoute.patch('/:consumidoresId', consumidoresupdateValidation, controller.updateIdConsumidores.bind(controller));

// DELETE -> Remove consumidor por ID
consumidoresRoute.delete('/:consumidoresId', controller.removeIdConsumidores.bind(controller));

export { consumidoresRoute as consumidoresRoutes };
