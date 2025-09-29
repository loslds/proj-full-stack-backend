
// /use-cases/consumidor/consumidores.route.ts
import { Router, Request, Response, NextFunction } from 'express';
import { ClientesController } from './clientes.controller';
import { ClientesRepository } from './clientes.repository';
import { dbSource } from '../start/dbSource';
import { clientescreateValidation, clientesupdateValidation } from './clientes.validation';
import { ParsedQs } from 'qs';

interface SearchQuery extends ParsedQs {
  id?: string;
  nome?: string;
  fantasy?: string;
}
const clientesRepository = new ClientesRepository(dbSource);
const controller = new ClientesController(clientesRepository);

const clientesRoute = Router();

// Tipagem para a rota de busca
interface SearchQuery {
  id?: string;
  nome?: string;
  fantasy?: string;
}

clientesRoute.get('/', controller.findAllClientes.bind(controller));
clientesRoute.post('/', clientescreateValidation, controller.createNewClientes.bind(controller));
clientesRoute.get('/:clientesId', controller.getOneClientesId.bind(controller));
clientesRoute.patch('/:clientesId', clientesupdateValidation, controller.updateIdClientes.bind(controller));
clientesRoute.delete('/:clientesId', controller.removeIdClientes.bind(controller));
clientesRoute.get('/by-one-name', controller.findOneClientesNome.bind(controller));
clientesRoute.get('/by-one-fantasy', controller.findOneClientesFantasy.bind(controller));
clientesRoute.get('/by-pessoas/:pessoasId', controller.findAllClientesPessoasId.bind(controller));
clientesRoute.get('/by-imagens/:imagensId', controller.findAllClientesImagensId.bind(controller));
clientesRoute.get('/search', controller.searchClientes.bind(controller));
clientesRoute.get('/details', controller.findAllClientesByDetails.bind(controller));

export { clientesRoute, clientesRepository };
