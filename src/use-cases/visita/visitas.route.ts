

// C:\repository\proj-full-stack-backend\src\use-cases\visita\visitas.route.ts
// C:\repository\proj-full-stack-backend\src\use-cases\visita\visitas.route.ts
import { Router } from 'express';
import { AppDataSource } from '../../config/db';
import { VisitasController } from './visitas.controller';
import { VisitasRepository } from './visitas.repository';
import {
  visitascreateValidation,
  visitasupdateValidation
} from './visitas.validation';

const visitasRepository = new VisitasRepository(AppDataSource);
const controller = new VisitasController(visitasRepository);
const visitasRoute = Router();

// ==========================================================
// ROTAS FIXAS
// Sempre declarar antes das rotas dinâmicas
// ==========================================================

// GET -> Lista todas as visitas
visitasRoute.get('/', controller.findAllVisitas.bind(controller));

// GET -> Pesquisa combinada
visitasRoute.get('/search', controller.searchVisitasAll.bind(controller));

// GET -> Pesquisa por nome aproximado
visitasRoute.get('/search-nome', controller.searchVisitasNome.bind(controller));

// GET -> Pesquisa por fantasy aproximado
visitasRoute.get('/search-fantasy', controller.searchVisitasFantasy.bind(controller));

// GET -> Histórico por visitante
visitasRoute.get(
  '/visitante/:visitantesId',
  controller.findAllVisitasVisitante.bind(controller)
);

// GET -> Quantidade de visitas por visitante
visitasRoute.get(
  '/count/:visitantesId',
  controller.countVisitasVisitante.bind(controller)
);

// GET -> Soma do tempo de visitas por visitante
visitasRoute.get(
  '/tempo/:visitantesId',
  controller.sumTempoVisitasVisitante.bind(controller)
);

// POST -> Registrar entrada (login)
visitasRoute.post(
  '/entrada',
  visitascreateValidation,
  controller.createEntradaVisitas.bind(controller)
);

// PATCH -> Registrar saída (logoff)
visitasRoute.patch(
  '/saida/:visitasId',
  controller.registrarSaidaVisitas.bind(controller)
);

// ==========================================================
// ROTAS DINÂMICAS
// ==========================================================

// GET -> Busca visita por ID
visitasRoute.get(
  '/:visitasId',
  controller.getOneVisitasId.bind(controller)
);

// PATCH -> Atualiza visita por ID
visitasRoute.patch(
  '/:visitasId',
  visitasupdateValidation,
  controller.updateIdVisitas.bind(controller)
);

// DELETE -> Remove visita por ID
visitasRoute.delete(
  '/:visitasId',
  controller.removeIdVisitas.bind(controller)
);

export { visitasRoute as visitasRoutes };