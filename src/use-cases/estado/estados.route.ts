
// C:\repository\proj-full-stack-backend\src\use-cases\estado\estados.route.ts
import { AppDataSource } from '../../config/db';
import { Router } from 'express';
import { EstadosController } from './estados.controller';
import { EstadosRepository } from './estados.repository';
import { estadoscreateValidation, estadosupdateValidation } from './estados.validation';

const estadosRepository = new EstadosRepository(AppDataSource);
const controller = new EstadosController(estadosRepository);
const estadosRoute = Router();

// ======================= ROTAS FIXAS =======================
// Sempre colocar primeiro as rotas que NÃO possuem parâmetros
estadosRoute.get('/', controller.findAllEstados.bind(controller));

estadosRoute.get('/search', controller.searchEstadosAll.bind(controller));
estadosRoute.get('/search-nome', controller.searchEstadosNome.bind(controller));
estadosRoute.get('/search-prefixo', controller.searchEstadosPrefixo.bind(controller));

estadosRoute.get('/one-nome', controller.findOneEstadosNome.bind(controller));
estadosRoute.get('/all-nome', controller.findAllEstadosNome.bind(controller));

estadosRoute.get('/one-prefixo', controller.findOneEstadosPrefixo.bind(controller));
estadosRoute.get('/all-prefixo', controller.findAllEstadosPrefixo.bind(controller));

estadosRoute.post(
  '/',
  estadoscreateValidation,
  controller.createNewEstados.bind(controller)
);

// ======================= ROTAS DINÂMICAS =======================
estadosRoute.get('/:estadosId', controller.getOneEstadosId.bind(controller));
estadosRoute.patch(
  '/:estadosId',
  estadosupdateValidation,
  controller.updateIdEstados.bind(controller)
);
estadosRoute.delete('/:estadosId', controller.removeIdEstados.bind(controller));

// EXPORTAÇÃO
export { estadosRoute as estadosRoutes };
