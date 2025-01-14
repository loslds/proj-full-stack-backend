
import { Router, RequestHandler } from 'express';

import { ConsumidorController } from './consumidor.controller';
import { ConsumidorRepository } from './consumidor.repository';
import { dataSource } from '../../database/dataSource';
import { createValidation, updateValidation } from './consumidor.validation';

const consumidorRepository = new ConsumidorRepository(dataSource);
const controller = new ConsumidorController(consumidorRepository);
const consumidorRoute = Router();

consumidorRoute.get('/', (req, res, next) => controller.findAll(req, res, next));
consumidorRoute.post('/', createValidation, (req, res, next) => controller.create(req, res, next));
consumidorRoute.get('/:consumidorId', (req, res, next) => controller.getOne(req, res, next));

consumidorRoute.patch('/:consumidorId', updateValidation, controller.update as unknown as RequestHandler);
consumidorRoute.delete('/:consumidorId', (req, res, next) => controller.remove(req, res, next));
consumidorRoute.get('/by-name', (req, res, next) => controller.findByName(req, res, next));
consumidorRoute.get('/by-fantasy', (req, res, next) => controller.findByFantasy(req, res, next));
consumidorRoute.get('/pessoa/:pessoaId', (req, res, next) => controller.findAllByPessoaId(req, res, next));
consumidorRoute.get('/empresa/:empresaId', (req, res, next) => controller.findAllByEmpresaId(req, res, next));

export { consumidorRoute, consumidorRepository };
