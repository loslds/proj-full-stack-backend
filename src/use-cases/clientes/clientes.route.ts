
import { Router, RequestHandler } from 'express';

import { ClientesController } from './clientes.controller';
import { ClientesRepository } from './clientes.repository';
import { dataSource } from '../../database/dataSource';
import { createValidation, updateValidation } from './clientes.validation';

const clientesRepository = new ClientesRepository(dataSource);
const controller = new ClientesController(clientesRepository);
const clientesRoute = Router();

clientesRoute.get('/', (req, res, next) => controller.findAll(req, res, next));
clientesRoute.post('/', createValidation, (req, res, next) => controller.create(req, res, next));
clientesRoute.get('/:clientesId', (req, res, next) => controller.getOne(req, res, next));
clientesRoute.patch('/:clientesId', updateValidation, controller.update as unknown as RequestHandler);
clientesRoute.delete('/:clientesId', (req, res, next) => controller.remove(req, res, next));
clientesRoute.get('/by-name', (req, res, next) => controller.findByName(req, res, next));
clientesRoute.get('/by-fantasy', (req, res, next) => controller.findByFantasy(req, res, next));
clientesRoute.get('cliente/by-pessoa/:pessoaId', (req, res, next) => controller.findAllByPessoaId(req, res, next));
clientesRoute.get('cliente/by-empresa/:empresaId', (req, res, next) => controller.findAllByEmpresaId(req, res, next));

export { clientesRoute, clientesRepository };
