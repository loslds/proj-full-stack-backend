

import { Router, RequestHandler } from 'express';

import { ConsumidoresController } from './consumidores.controller';
import { ConsumidoresRepository } from './consumidores.repository';
import { dataSource } from '../start/dbSource';
import { createValidation, updateValidation } from './consumidores.validation';

const consumidoresRepository = new ConsumidoresRepository(dataSource);
const controller = new ConsumidoresController(consumidoresRepository);
const consumidoresRoute = Router();

consumidoresRoute.get('/', (req, res, next) => controller.findAll(req, res, next));
consumidoresRoute.post('/', createValidation, (req, res, next) => controller.create(req, res, next));
consumidoresRoute.get('/:consumidoresId', (req, res, next) => controller.getOne(req, res, next));

consumidoresRoute.patch('/:consumidoresId', updateValidation, controller.update as unknown as RequestHandler);
consumidoresRoute.delete('/:consumidoresId', (req, res, next) => controller.remove(req, res, next));
consumidoresRoute.get('/by-name', (req, res, next) => controller.findByName(req, res, next));
consumidoresRoute.get('/by-fantasy', (req, res, next) => controller.findByFantasy(req, res, next));
consumidoresRoute.get('consumidor/by-pessoa/:pessoaId', (req, res, next) => controller.findAllByPessoaId(req, res, next));
consumidoresRoute.get('consumidor/by-/empresa/:empresaId', (req, res, next) => controller.findAllByEmpresaId(req, res, next));

export { consumidoresRoute, consumidoresRepository };
