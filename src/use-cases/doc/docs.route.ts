
// C:\repository\proj-full-stack-backend\src\use-cases\doc\docs.route.ts
import { Router } from 'express';
import { AppDataSource } from '../../config/db';
import { DocsController } from './docs.controller';
import { DocsRepository } from './docs.repository';
import {
  docscreateValidation,
  docsupdateValidation
} from './docs.validation';

const docsRepository = new DocsRepository(AppDataSource);
const controller = new DocsController(docsRepository);
const docsRoute = Router();

// ==========================================================
// ROTAS FIXAS
// ==========================================================

// GET → Lista todos
docsRoute.get('/', controller.findAllDocs.bind(controller));

// GET → Pesquisa combinada
docsRoute.get('/search', controller.searchDocsAll.bind(controller));

// GET → Pesquisa parcial
docsRoute.get('/search-text', controller.searchDocsParcial.bind(controller));

// GET → CPF exato
docsRoute.get('/one-cpf', controller.findOneDocsCpf.bind(controller));

// GET → Todos CPF
docsRoute.get('/all-cpf', controller.findAllDocsCpf.bind(controller));

// GET → CNPJ exato
docsRoute.get('/one-cnpj', controller.findOneDocsCnpj.bind(controller));

// GET → Todos CNPJ
docsRoute.get('/all-cnpj', controller.findAllDocsCnpj.bind(controller));

// GET → INSCR_ESTADUAL exato
docsRoute.get('/one-inscr-estadual', controller.findOneDocsByInscrEstadual.bind(controller));

// GET → Todos INSCR_ESTADUAL
docsRoute.get('/all-inscr-estadual', controller.findAllDocsByInscrEstadual.bind(controller));

// GET → INSCR_MUNICIPAL exato
docsRoute.get('/one-inscr-municipal', controller.findOneDocsByInscrMunicipal.bind(controller));

// GET → Todos INSCR_MUNICIPAL
docsRoute.get('/all-inscr-municipal', controller.findAllDocsByInscrMunicipal.bind(controller));

// GET → Por cadastro
docsRoute.get('/cadastros/:cadastrosId', controller.findAllDocsCadastrosId.bind(controller));

// GET → Details
docsRoute.get('/details', controller.listAllDocsDetails.bind(controller));

// POST → Criar
docsRoute.post('/', docscreateValidation, controller.createNewDocs.bind(controller));

// ==========================================================
// ROTAS DINÂMICAS
// ==========================================================

// GET → Buscar por ID
docsRoute.get('/:docsId', controller.getOneDocsId.bind(controller));

// PATCH → Atualizar
docsRoute.patch('/:docsId', docsupdateValidation, controller.updateIdDocs.bind(controller));

// DELETE → Remover
docsRoute.delete('/:docsId', controller.removeIdDocs.bind(controller));

export { docsRoute as docsRoutes };
