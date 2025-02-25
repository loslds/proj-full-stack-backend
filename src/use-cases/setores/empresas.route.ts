
import { Router, RequestHandler } from 'express';

import { SetoresController } from './setores.controller';
import { SetoresRepository } from './setores.repository';
import { dataSource } from '../../database/dataSource';
import { createValidation, updateValidation } from './setores.validation';

const setoresRepository = new SetoresRepository(dataSource);
const controller = new SetoresController(setoresRepository);
const setoresRoute = Router();

setoresRoute.get('/', (req, res, next) => controller.findAll(req, res, next));
setoresRoute.post('/', createValidation, (req, res, next) => controller.create(req, res, next));
setoresRoute.get('/:setoresId', (req, res, next) => controller.getOne(req, res, next));

setoresRoute.patch('/:setoresId', updateValidation, controller.update as unknown as RequestHandler);
setoresRoute.delete('/:setoresId', (req, res, next) => controller.remove(req, res, next));
setoresRoute.get('/by-name', (req, res, next) => controller.findByName(req, res, next));
setoresRoute.get('/by-acao', (req, res, next) => controller.findByAcao(req, res, next));
setoresRoute.get('/by-nivel', (req, res, next) => controller.findByNivel(req, res, next));

export { setoresRoute, setoresRepository };


