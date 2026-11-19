// C:\repository\proj-full-stack-backend\src\use-cases\arquivado\arquivados.route.ts

import { Router } from 'express';
import { AppDataSource } from '../../config/db';
import { ArquivadosController } from './arquivados.controller';
import { ArquivadosRepository } from './arquivados.repository';
import {
  arquivadoscreateValidation,
  arquivadosupdateValidation
} from './arquivados.validation';

const arquivadosRepository = new ArquivadosRepository(AppDataSource);
const controller = new ArquivadosController(arquivadosRepository);
const arquivadosRoute = Router();

// ==========================================================
// ROTAS FIXAS
// Sempre declarar antes das rotas dinâmicas
// ==========================================================

// GET -> Lista todos os arquivados
arquivadosRoute.get('/', controller.findAllArquivados.bind(controller));

// GET -> Pesquisa combinada
arquivadosRoute.get('/search', controller.searchArquivadosAll.bind(controller));

// GET -> Histórico de um registro (tab_origem + id_origem)
arquivadosRoute.get('/origem', controller.findAllArquivadosOrigem.bind(controller));

// POST -> Cria novo arquivado
arquivadosRoute.post(
  '/',
  arquivadoscreateValidation,
  controller.createNewArquivados.bind(controller)
);

// ==========================================================
// ROTAS DINÂMICAS
// ==========================================================

// GET -> Busca por ID
arquivadosRoute.get('/:arquivadosId', controller.getOneArquivadosId.bind(controller));

// PATCH -> Atualiza por ID
arquivadosRoute.patch(
  '/:arquivadosId',
  arquivadosupdateValidation,
  controller.updateIdArquivados.bind(controller)
);

// DELETE -> Remove por ID
arquivadosRoute.delete('/:arquivadosId', controller.removeIdArquivados.bind(controller));

export { arquivadosRoute as arquivadosRoutes };
