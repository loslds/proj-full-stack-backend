import { Router, RequestHandler } from 'express';

import { EmpresasController } from './empresas.controller';
import { EmpresasRepository } from './empresas.repository';
import { dataSource } from '../../database/dataSource';
import { createValidation, updateValidation } from './empresas.validation';

const empresasRepository = new EmpresasRepository(dataSource);
const controller = new EmpresasController(empresasRepository);
const empresasRoute = Router();

empresasRoute.get('/', (req, res, next) => controller.findAll(req, res, next));
empresasRoute.post('/', createValidation, (req, res, next) => controller.create(req, res, next));
empresasRoute.get('/:empresasId', (req, res, next) => controller.getOne(req, res, next));

empresasRoute.patch('/:empresasId', updateValidation, controller.update as unknown as RequestHandler);
empresasRoute.delete('/:empresasId', (req, res, next) => controller.remove(req, res, next));
empresasRoute.get('/by-name', (req, res, next) => controller.findByName(req, res, next));
empresasRoute.get('/by-fantasy', (req, res, next) => controller.findByFantasy(req, res, next));
empresasRoute.get('empresa/by-pessoa/:pessoaId', (req, res, next) => controller.findAllByPessoaId(req, res, next));

export { empresasRoute, empresasRepository };
