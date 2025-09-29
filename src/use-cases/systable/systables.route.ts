
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
systableRoute.get('/:systablesId', (req: Request<{ systablesId: string }>, res: Response, next: NextFunction) => controller.getOneSysTables(req, res, next));
systableRoute.post('/', createValidation, (req: Request, res: Response, next: NextFunction) => controller.createSysTables(req, res, next));
systableRoute.patch('/:systablesId', updateValidation, (req: Request<{ systablesId: string }>, res: Response, next: NextFunction) => controller.updateIdSysTables(req, res, next));
systableRoute.delete('/:systablesId', (req: Request<{ systablesId: string }>, res: Response, next: NextFunction) => controller.removeIdSysTables(req, res, next));

systableRoute.get('/search', (req, res, next) => controller.searchSysTables(req, res, next));
systableRoute.get('/search-name', (req, res, next) => controller.searchByNameSysTables(req, res, next));
systableRoute.get('/search-chkdb', (req, res, next) => controller.searchByChkdbSysTables(req, res, next));
systableRoute.get('/search-regs', (req, res, next) => controller.searchByNumberregsSysTables(req, res, next));

systableRoute.get('/one-nome', (req, res, next) => controller.findOneNomeSysTables(req, res, next));
systableRoute.get('/all-nome', (req, res, next) => controller.findListByNomeSysTables(req, res, next));
systableRoute.get('/all-chkdb', (req, res, next) => controller.findListNomeByChkdbSysTables(req, res, next));
systableRoute.get('/all-regs', (req, res, next) => controller.findListNomeByNumberregsSysTables(req, res, next));


////////////////////////////
export { systableRoute, systablesRepository };

