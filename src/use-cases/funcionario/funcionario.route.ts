
import { Router, RequestHandler } from 'express';

import { FuncionarioController } from './funcionario.controller';
import { FuncionarioRepository } from './funcionario.repository';
import { dataSource } from '../../database/dataSource';
import { createValidation, updateValidation } from './funcionario.validation';

const funcionarioRepository = new FuncionarioRepository(dataSource);
const controller = new FuncionarioController(funcionarioRepository);
const funcionarioRoute = Router();

funcionarioRoute.get('/', (req, res, next) => controller.findAll(req, res, next));
funcionarioRoute.post('/', createValidation, (req, res, next) => controller.create(req, res, next));
funcionarioRoute.get('/:funcionarioId', (req, res, next) => controller.getOne(req, res, next));

funcionarioRoute.patch('/:funcionarioId', updateValidation, controller.update as unknown as RequestHandler);
funcionarioRoute.delete('/:funcionarioId', (req, res, next) => controller.remove(req, res, next));
funcionarioRoute.get('/by-name', (req, res, next) => controller.findByName(req, res, next));
funcionarioRoute.get('/by-fantasy', (req, res, next) => controller.findByFantasy(req, res, next));
funcionarioRoute.get('/pessoa/:pessoaId', (req, res, next) => controller.findAllByPessoaId(req, res, next));
funcionarioRoute.get('/empresa/:empresaId', (req, res, next) => controller.findAllByEmpresaId(req, res, next));

export { funcionarioRoute, funcionarioRepository };
