
import { Router, Request, Response, NextFunction } from 'express';
import { Data_sysController } from './data_sys.controller';
import { Data_SysRepository } from './data_sys.repository';
import { dataSource } from '../../database/dataSource';
import { createValidation, updateValidation } from './data_sys.validation';

const data_sysRepository = new Data_SysRepository(dataSource);
const controller = new Data_sysController(data_sysRepository);
const datasysRoute = Router();

datasysRoute.get('/', (req: Request, res: Response, next: NextFunction) => controller.findAll(req, res, next));

datasysRoute.get('/:datasysId', (req: Request<{ datasysId: string }>, res: Response, next: NextFunction) => controller.getOne(req, res, next));

datasysRoute.patch('/:datasysId', updateValidation, (req: Request<{ datasysId: string }>, res: Response, next: NextFunction) => controller.update(req, res, next));

datasysRoute.delete('/:datasysId', (req: Request<{ datasysId: string }>, res: Response, next: NextFunction) => controller.remove(req, res, next));

datasysRoute.post('/', createValidation, (req: Request, res: Response, next: NextFunction) => controller.create(req, res, next));

datasysRoute.get('/search', (req, res, next) => controller.search(req, res, next));

////////////////////////////
datasysRoute.get('/by-datasys', (req, res, next) => controller.findAll(req, res, next));

datasysRoute.get('/search-name', (req, res, next) => controller.searchByName(req, res, next));

datasysRoute.get('/search-chkdb', (req, res, next) => controller.searchByChkdb(req, res, next));

////////////////////////////

export { datasysRoute, data_sysRepository};
