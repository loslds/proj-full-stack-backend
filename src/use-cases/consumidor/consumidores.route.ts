
// /use-cases/consumidor/consumidores.route.ts
import { Router, Request, Response, NextFunction } from 'express';
import { ConsumidoresController } from './consumidores.controller';
import { ConsumidoresRepository } from './consumidores.repository';
import { dbSource } from '../start/dbSource';
import { consumidorescreateValidation, consumidoresupdateValidation } from './consumidores.validation';
import { ParsedQs } from 'qs';

interface SearchQuery extends ParsedQs {
  id?: string;
  nome?: string;
  fantasy?: string;
}
const consumidoresRepository = new ConsumidoresRepository(dbSource);
const controller = new ConsumidoresController(consumidoresRepository);
const consumidoresRoute = Router();

// Tipagem para a rota de busca
interface SearchQuery {
  id?: string;
  nome?: string;
  fantasy?: string;
}

consumidoresRoute.get('/', controller.findAllConsumidores.bind(controller));
consumidoresRoute.post('/', consumidorescreateValidation, controller.createNewConsumidores.bind(controller));
consumidoresRoute.get('/:consumidoresId', controller.getOneConsumidoresId.bind(controller));
consumidoresRoute.patch('/:consumidoresId', consumidoresupdateValidation, controller.updateIdConsumidores.bind(controller));
consumidoresRoute.delete('/:consumidoresId', controller.removeIdConsumidores.bind(controller));
consumidoresRoute.get('/by-one-name', controller.findOneConsumidoresNome.bind(controller));
consumidoresRoute.get('/by-one-fantasy', controller.findOneConsumidoresFantasy.bind(controller));
consumidoresRoute.get('/by-pessoas/:pessoasId', controller.findAllConsumidoresPessoasId.bind(controller));
consumidoresRoute.get('/by-imagens/:imagensId', controller.findAllConsumidoresImagensId.bind(controller));
consumidoresRoute.get('/search', controller.searchConsumidores.bind(controller));
consumidoresRoute.get('/details', controller.findAllConsumidoresByDetails.bind(controller));

export { consumidoresRoute, consumidoresRepository };
