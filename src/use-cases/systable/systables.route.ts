// C:\repository\proj-full-stack-backend\src\use-cases\systable\systables.route.ts

import { dbSource } from '../../database';
import { Router, Request, Response, NextFunction } from 'express';
import { SystablesController } from './systables.controller';
import { SystablesRepository } from './systables.repository';
import { createValidation, updateValidation } from './systables.validation';

const systablesRepository = new SystablesRepository(dbSource);
const controller = new SystablesController(systablesRepository);
const systableRoute = Router();

/* ------------------------ ROTAS DE PESQUISA ------------------------ */
systableRoute.get('/search', (req, res, next) => controller.searchSysTables(req, res, next));
systableRoute.get('/search-name', (req, res, next) => controller.searchSysTablesByNome(req, res, next));
systableRoute.get('/search-chkdb', (req, res, next) => controller.searchSysTablesByChkdb(req, res, next));
systableRoute.get('/search-regs', (req, res, next) => controller.searchSysTablesByNumberregs(req, res, next));

/* ------------------- ROTAS DE LISTAGENS DIRETAS -------------------- */
systableRoute.get('/one-nome', (req, res, next) => controller.findOneSysTablesNome(req, res, next));
systableRoute.get('/all-nome', (req, res, next) => controller.findListSysTablesByNome(req, res, next));
systableRoute.get('/all-chkdb', (req, res, next) => controller.findListSysTablesChkdb(req, res, next));
systableRoute.get('/all-regs', (req, res, next) => controller.findListSysTablesNumberregs(req, res, next));

/* -------------------------- CRUD BÁSICO ---------------------------- */
systableRoute.get('/', (req, res, next) => controller.findAllSysTables(req, res, next));
systableRoute.post('/', createValidation, (req, res, next) => controller.createSysTables(req, res, next));

/* ---- IMPORTANTE: rota paramétrica sempre deve vir por último ------ */
systableRoute.get('/:systablesId', (req: Request<{ systablesId: string }>, res, next) => 
  controller.getOneSysTablesId(req, res, next)
);

systableRoute.patch('/:systablesId', updateValidation, (req: Request<{ systablesId: string }>, res, next) => 
  controller.updateIdSysTables(req, res, next)
);

systableRoute.delete('/:systablesId', (req: Request<{ systablesId: string }>, res, next) => 
  controller.removeIdSysTables(req, res, next)
);

export { systableRoute, systablesRepository };
