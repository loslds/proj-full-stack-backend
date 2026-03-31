
// C:\repository\proj-full-stack-backend\src\use-cases\fone\fones.route.ts
import { Router } from 'express';
import { AppDataSource } from '../../config/db';
import { FonesController } from './fones.controller';
import { FonesRepository } from './fones.repository';
import { fonescreateValidation, fonesupdateValidation } from './fones.validation';

const fonesRepository = new FonesRepository(AppDataSource);
const controller = new FonesController(fonesRepository);
const fonesRoute = Router();

// ==========================================================
// ROTAS FIXAS
// ==========================================================

// GET → Lista todos
fonesRoute.get('/', controller.findAllFones.bind(controller));

// GET → Pesquisa combinada
fonesRoute.get('/search', controller.searchFonesAll.bind(controller));

// GET → Pesquisa parcial
fonesRoute.get('/search-text', controller.searchFonesParcial.bind(controller));

// GET → Fone fixo exato
fonesRoute.get('/one-fixo', controller.findOneFonesFixo.bind(controller));

// GET → Todos fones fixos
fonesRoute.get('/all-fixo', controller.findAllFonesFixo.bind(controller));

// GET → Fone celular exato
fonesRoute.get('/one-celular', controller.findOneFonesCelular.bind(controller));

// GET → Todos fones celular
fonesRoute.get('/all-celular', controller.findAllFonesCelular.bind(controller));

// GET → Fone contacto exato
fonesRoute.get('/one-contacto', controller.findOneFonesContacto.bind(controller));

// GET → Todos fones contacto
fonesRoute.get('/all-contacto', controller.findAllFonesContacto.bind(controller));

// GET → Por cadastro
fonesRoute.get('/cadastros/:cadastrosId', controller.findAllFonesCadastrosId.bind(controller));

// GET → Details
fonesRoute.get('/details', controller.listAllFonesDetails.bind(controller));

// POST → Criar
fonesRoute.post('/', fonescreateValidation, controller.createNewFones.bind(controller));

// ==========================================================
// ROTAS DINÂMICAS
// ==========================================================

// GET → Buscar por ID
fonesRoute.get('/:fonesId', controller.getOneFonesId.bind(controller));

// PATCH → Atualizar
fonesRoute.patch('/:fonesId', fonesupdateValidation, controller.updateIdFones.bind(controller));

// DELETE → Remover
fonesRoute.delete('/:fonesId', controller.removeIdFones.bind(controller));

export { fonesRoute as fonesRoutes };
