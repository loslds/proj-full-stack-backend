

// C:\repository\proj-full-stack-backend\src\use-cases\visita\visitas.route.ts
import { Router } from 'express';
import { AppDataSource } from '../../config/db';
import { VisitasController } from './visitas.controller';
import { VisitasRepository } from './visitas.repository';

const visitasRepository = new VisitasRepository(AppDataSource);
const controller = new VisitasController(visitasRepository);
const visitasRoute = Router();

// ==========================================================
// ROTAS FIXAS
// Sempre declarar antes das rotas dinâmicas
// ==========================================================

// GET -> Lista todas as visitas
visitasRoute.get('/', controller.findAllVisitas.bind(controller));

// GET -> Pesquisa combinada por id, id_visitantes, nome e fantasy
visitasRoute.get('/search', controller.searchVisitasAll.bind(controller));

// GET -> Pesquisa por nome aproximado do visitante
visitasRoute.get('/search-nome', controller.searchVisitasNomeVisitante.bind(controller));

// GET -> Pesquisa por fantasy aproximado do visitante
visitasRoute.get('/search-fantasy', controller.searchVisitasFantasyVisitante.bind(controller));

// GET -> Histórico de visitas por nome do visitante
visitasRoute.get('/historico-nome', controller.findHistoricoVisitasNomeVisitante.bind(controller));

// GET -> Histórico de visitas por fantasy do visitante
visitasRoute.get('/historico-fantasy', controller.findHistoricoVisitasFantasyVisitante.bind(controller));

// GET -> Histórico de visitas por visitante
visitasRoute.get('/historico/visitantes/:visitantesId', controller.findHistoricoVisitasVisitantesId.bind(controller));

// GET -> Busca todas as visitas por visitante
visitasRoute.get('/visitantes/:visitantesId', controller.findAllVisitasVisitantesId.bind(controller));

// GET -> Lista visitas com detalhes
visitasRoute.get('/details', controller.listAllVisitasDetails.bind(controller));

// POST -> Registra entrada do visitante
visitasRoute.post('/entrada', controller.registerEntradaVisitas.bind(controller));

// PATCH -> Registra saída do visitante
visitasRoute.patch('/saida/:visitasId', controller.registerSaidaVisitas.bind(controller));

// ==========================================================
// ROTAS DINÂMICAS
// ==========================================================

// GET -> Busca visita por ID
visitasRoute.get('/:visitasId', controller.getOneVisitasId.bind(controller));

// DELETE -> Remove visita por ID
visitasRoute.delete('/:visitasId', controller.removeIdVisitas.bind(controller));

export { visitasRoute as visitasRoutes };

