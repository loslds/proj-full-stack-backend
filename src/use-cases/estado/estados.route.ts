
// C:\repository\proj-full-stack-backend\src\use-cases\estado\estados.route.ts

import { dbSource } from '../../database';
import { Router } from 'express';
import { EstadosRepository } from './estados.repository';
import { EstadosController } from './estados.controller';
import { estadoscreateValidation, estadosupdateValidation } from './estados.validation';

const estadosRepository = new EstadosRepository(dbSource);
const controller = new EstadosController(estadosRepository);
const estadosRoute = Router();

// ======================= ROTAS =======================
estadosRoute.get('/', controller.findAllEstados.bind(controller));
estadosRoute.post('/', estadoscreateValidation, controller.createNewEstados.bind(controller));
estadosRoute.get('/:estadosId', controller.getOneEstadosId.bind(controller));
estadosRoute.patch('/:estadosId', estadosupdateValidation, controller.updateIdEstados.bind(controller));
estadosRoute.delete('/:estadosId', controller.removeIdEstados.bind(controller));
estadosRoute.get('/search', controller.searchEstadosAll.bind(controller));
estadosRoute.get('/search-name', controller.searchEstadosName.bind(controller));
estadosRoute.get('/search-uf', controller.searchEstadosUf.bind(controller));
estadosRoute.get('/one-nome', controller.findOneEstadosNome.bind(controller));
estadosRoute.get('/all-nome', controller.findAllEstadosNome.bind(controller));
estadosRoute.get('/one-uf', controller.findOneEstadosUf.bind(controller));
estadosRoute.get('/all-uf', controller.findAllEstadosUf.bind(controller));


export { estadosRoute, estadosRepository };


