
// C:\repository\proj-full-stack-backend\src\use-cases\cadastro\cadastros.route.ts
import { Router } from 'express';
import { AppDataSource } from '../../config/db';
import { CadastrosController } from './cadastros.controller';
import { CadastrosRepository } from './cadastros.repository';
import {
  cadastroscreateValidation,
  cadastrosupdateValidation
} from './cadastros.validation';

const cadastrosRepository = new CadastrosRepository(AppDataSource);
const controller = new CadastrosController(cadastrosRepository);
const cadastrosRoute = Router();

// ==========================================================
// ROTAS FIXAS
// Sempre declarar antes das rotas dinâmicas
// ==========================================================

// GET -> Lista todos os cadastros
cadastrosRoute.get('/', controller.findAllCadastros.bind(controller));

// GET -> Pesquisa combinada
cadastrosRoute.get('/search', controller.searchCadastrosAll.bind(controller));

// GET -> Pesquisa por endereço aproximado
cadastrosRoute.get('/search-endereco', controller.searchCadastrosEndereco.bind(controller));

// GET -> Pesquisa por bairro aproximado
cadastrosRoute.get('/search-bairro', controller.searchCadastrosBairro.bind(controller));

// GET -> Pesquisa por cep aproximado
cadastrosRoute.get('/search-cep', controller.searchCadastrosCep.bind(controller));

// GET -> Busca todos os cadastros por empresa
cadastrosRoute.get('/empresas/:empresasId', controller.findAllCadastrosEmpresasId.bind(controller));

// GET -> Busca todos os cadastros por visitante
cadastrosRoute.get('/visitantes/:visitantesId', controller.findAllCadastrosVisitantesId.bind(controller));

// GET -> Busca todos os cadastros por consumidor
cadastrosRoute.get('/consumidores/:consumidoresId', controller.findAllCadastrosConsumidoresId.bind(controller));

// GET -> Busca todos os cadastros por cliente
cadastrosRoute.get('/clientes/:clientesId', controller.findAllCadastrosClientesId.bind(controller));

// GET -> Busca todos os cadastros por fornecedor
cadastrosRoute.get('/fornecedores/:fornecedoresId', controller.findAllCadastrosFornecedoresId.bind(controller));

// GET -> Busca todos os cadastros por funcionário
cadastrosRoute.get('/funcionarios/:funcionariosId', controller.findAllCadastrosFuncionariosId.bind(controller));

// GET -> Lista cadastros com detalhes
cadastrosRoute.get('/details', controller.listAllCadastrosDetails.bind(controller));

// POST -> Cria novo cadastro
cadastrosRoute.post('/', cadastroscreateValidation, controller.createNewCadastros.bind(controller)
);

// ==========================================================
// ROTAS DINÂMICAS
// ==========================================================

// GET -> Busca cadastro por ID
cadastrosRoute.get('/:cadastrosId', controller.getOneCadastrosId.bind(controller));

// PATCH -> Atualiza cadastro por ID
cadastrosRoute.patch('/:cadastrosId', cadastrosupdateValidation, controller.updateIdCadastros.bind(controller));

// DELETE -> Remove cadastro por ID
cadastrosRoute.delete('/:cadastrosId', controller.removeIdCadastros.bind(controller));

export { cadastrosRoute as cadastrosRoutes };