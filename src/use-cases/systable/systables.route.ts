
// C:\repository\proj-full-stack-backend\src\use-cases\systable\systables.route.ts
import { dbSource } from '../../database';
import { Router, Request, Response, NextFunction } from 'express';
import { SystablesController } from './systables.controller';
import { SystablesRepository } from './systables.repository';
import { createValidation, updateValidation } from './systables.validation';

const systablesRepository = new SystablesRepository(dbSource);
const controller = new SystablesController(systablesRepository);
const systableRoute = Router();

systableRoute.get('/', (req: Request, res: Response, next: NextFunction) => controller.findAllSysTables(req, res, next));
systableRoute.get('/:systablesId', (req: Request<{ systablesId: string }>, res: Response, next: NextFunction) => controller.getOneSysTablesId(req, res, next));
systableRoute.post('/', createValidation, (req: Request, res: Response, next: NextFunction) => controller.createSysTables(req, res, next));
systableRoute.patch('/:systablesId', updateValidation, (req: Request<{ systablesId: string }>, res: Response, next: NextFunction) => controller.updateIdSysTables(req, res, next));
systableRoute.delete('/:systablesId', (req: Request<{ systablesId: string }>, res: Response, next: NextFunction) => controller.removeIdSysTables(req, res, next));

systableRoute.get('/search', (req, res, next) => controller.searchSysTables(req, res, next));
systableRoute.get('/search-name', (req, res, next) => controller.searchSysTablesByNome(req, res, next));
systableRoute.get('/search-chkdb', (req, res, next) => controller.searchSysTablesByChkdb(req, res, next));
systableRoute.get('/search-regs', (req, res, next) => controller.searchSysTablesByNumberregs(req, res, next));

systableRoute.get('/one-nome', (req, res, next) => controller.findOneSysTablesNome(req, res, next));
systableRoute.get('/all-nome', (req, res, next) => controller.findListSysTablesByNome(req, res, next));
systableRoute.get('/all-chkdb', (req, res, next) => controller.findListSysTablesChkdb(req, res, next));
systableRoute.get('/all-regs', (req, res, next) => controller.findListSysTablesNumberregs(req, res, next));


////////////////////////////
export { systableRoute, systablesRepository };

