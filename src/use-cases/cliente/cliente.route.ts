
import { Router, RequestHandler } from 'express';

import { ClienteController } from './cliente.controller';
import { ClienteRepository } from './cliente.repository';
import { dataSource } from '../../database/dataSource';
import { createValidation, updateValidation } from './cliente.validation';

const clienteRepository = new ClienteRepository(dataSource);
const controller = new ClienteController(clienteRepository);
const clienteRoute = Router();

clienteRoute.get('/', (req, res, next) => controller.findAll(req, res, next));
clienteRoute.post('/', createValidation, (req, res, next) => controller.create(req, res, next));
clienteRoute.get('/:clienteId', (req, res, next) => controller.getOne(req, res, next));

clienteRoute.patch('/:clienteId', updateValidation, controller.update as unknown as RequestHandler);
clienteRoute.delete('/:clienteId', (req, res, next) => controller.remove(req, res, next));
clienteRoute.get('/by-name', (req, res, next) => controller.findByName(req, res, next));
clienteRoute.get('/by-fantasy', (req, res, next) => controller.findByFantasy(req, res, next));
clienteRoute.get('/pessoa/:pessoaId', (req, res, next) => controller.findAllByPessoaId(req, res, next));
clienteRoute.get('/empresa/:empresaId', (req, res, next) => controller.findAllByEmpresaId(req, res, next));

export { clienteRoute, clienteRepository };
