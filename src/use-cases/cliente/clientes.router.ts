

//C:\repository\proj-full-stack-backend\src\use-cases\cliente\clientes.router.ts
// C:\repository\proj-full-stack-backend\src\use-cases\cliente\clientes.route.ts
import { Router } from 'express';
import { AppDataSource } from '../../config/db';
import { ClientesController } from './clientes.controller';
import { ClientesRepository } from './clientes.repository';
import {
  clientescreateValidation,
  clientesupdateValidation
} from './clientes.validation';

const clientesRepository = new ClientesRepository(AppDataSource);
const controller = new ClientesController(clientesRepository);
const clientesRoute = Router();

// ==========================================================
// ROTAS FIXAS
// Sempre declarar antes das rotas dinâmicas
// ==========================================================

// GET -> Lista todos os clientes
clientesRoute.get('/', controller.findAllClientes.bind(controller));

// GET -> Pesquisa combinada por id, nome, fantasy, pessoa e empresa
clientesRoute.get('/search', controller.searchClientesAll.bind(controller));

// GET -> Pesquisa por nome aproximado
clientesRoute.get('/search-nome', controller.searchClientesNome.bind(controller));

// GET -> Pesquisa por fantasy aproximado
clientesRoute.get('/search-fantasy', controller.searchClientesFantasy.bind(controller));

// GET -> Busca um cliente por nome exato
clientesRoute.get('/one-nome', controller.findOneClientesNome.bind(controller));

// GET -> Busca todos os clientes por nome exato
clientesRoute.get('/all-nome', controller.findAllClientesNome.bind(controller));

// GET -> Busca um cliente por fantasy exato
clientesRoute.get('/one-fantasy', controller.findOneClientesFantasy.bind(controller));

// GET -> Busca todos os clientes por fantasy exato
clientesRoute.get('/all-fantasy', controller.findAllClientesFantasy.bind(controller));

// GET -> Busca todos os clientes por pessoa
clientesRoute.get('/pessoas/:pessoasId', controller.findAllClientesPessoasId.bind(controller));

// GET -> Busca todos os clientes por empresa
clientesRoute.get('/empresas/:empresasId', controller.findAllClientesEmpresasId.bind(controller));

// GET -> Lista clientes com detalhes
clientesRoute.get('/details', controller.listAllClientesDetails.bind(controller));

// POST -> Cria novo cliente
clientesRoute.post('/', clientescreateValidation, controller.createNewClientes.bind(controller));

// ==========================================================
// ROTAS DINÂMICAS
// ==========================================================

// GET -> Busca cliente por ID
clientesRoute.get('/:clientesId', controller.getOneClientesId.bind(controller));

// PATCH -> Atualiza cliente por ID
clientesRoute.patch('/:clientesId', clientesupdateValidation, controller.updateIdClientes.bind(controller));

// DELETE -> Remove cliente por ID
clientesRoute.delete('/:clientesId', controller.removeIdClientes.bind(controller));

export { clientesRoute as clientesRoutes };

