
//C:\repository\proj-full-stack-backend\src\use-cases\cargo\cargos.route.ts
import { Router } from 'express';
import { AppDataSource } from '../../config/db';
import { CargosController } from './cargos.controller';
import { CargosRepository } from './cargos.repository';
import { cargoscreateValidation, cargosupdateValidation } from './cargos.validation';

const cargosRepository = new CargosRepository(AppDataSource);
const controller = new CargosController(cargosRepository);
const cargosRoute = Router();

// ==========================================================
// ROTAS FIXAS
// ==========================================================

cargosRoute.get('/', controller.findAllCargos.bind(controller));
cargosRoute.get('/search', controller.searchCargosAll.bind(controller));
cargosRoute.get('/search-nome', controller.searchCargosNome.bind(controller));
cargosRoute.get('/one-nome', controller.findOneCargosNome.bind(controller));
cargosRoute.get('/all-nome', controller.findAllCargosNome.bind(controller));

cargosRoute.post('/', cargoscreateValidation, controller.createNewCargos.bind(controller));

// ==========================================================
// ROTAS DINÂMICAS
// ==========================================================

cargosRoute.get('/:cargosId', controller.getOneCargosId.bind(controller));

cargosRoute.patch('/:cargosId', cargosupdateValidation, controller.updateIdCargos.bind(controller));

cargosRoute.delete('/:cargosId', controller.removeIdCargos.bind(controller));

export { cargosRoute as cargosRoutes };