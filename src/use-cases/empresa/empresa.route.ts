import { Router, RequestHandler } from 'express';

import { EmpresaController } from './empresa.controller';
import { EmpresaRepository } from './empresa.repository';
import { dataSource } from '../../database/dataSource';
import { createValidation, updateValidation } from './empresa.validation';

const empresaRepository = new EmpresaRepository(dataSource);
const controller = new EmpresaController(empresaRepository);
const empresaRoute = Router();

empresaRoute.get('/', (req, res, next) => controller.findAll(req, res, next));
empresaRoute.post('/', createValidation, (req, res, next) => controller.create(req, res, next));
empresaRoute.get('/:empresaId', (req, res, next) => controller.getOne(req, res, next));

empresaRoute.patch('/:empresaId', updateValidation, controller.update as unknown as RequestHandler);
empresaRoute.delete('/:empresaId', (req, res, next) => controller.remove(req, res, next));
empresaRoute.get('/by-name', (req, res, next) => controller.findByName(req, res, next));
empresaRoute.get('/by-fantasy', (req, res, next) => controller.findByFantasy(req, res, next));
empresaRoute.get('/pessoa/:pessoaId', (req, res, next) => controller.findAllByPessoaId(req, res, next));

export { empresaRoute, empresaRepository };
