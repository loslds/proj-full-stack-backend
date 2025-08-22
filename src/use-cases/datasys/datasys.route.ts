
import { Router, Request, Response, NextFunction } from 'express';
import { DatasysController } from './datasys.controller';
import { DataSysRepository } from './datasys.repository';
import { dbSource } from '../start/dbSource';
import { createValidation, updateValidation } from './datasys.validation';

const data_sysRepository = new DataSysRepository(dbSource);
const controller = new DatasysController(data_sysRepository);
const datasysRoute = Router();

datasysRoute.get('/', (req, res, next) => controller.findAll(req, res, next));
datasysRoute.post('/', createValidation, (req, res, next) => controller.create(req, res, next));
datasysRoute.get('/:datasysId', (req, res, next) => controller.getOne(req, res, next));


/** GET Busca todos os registros de data_sys */ 
datasysRoute.get('/', (req: Request, res: Response, next: NextFunction) => controller.findAll(req, res, next));

/** GET Busca registro data_sys pelo ID */ 
datasysRoute.get('/:datasysId', (req: Request<{ datasysId: string }>, res: Response, next: NextFunction) => controller.getOne(req, res, next));

/** GET Busca registro data_sys pelo ID para Alterar*/ 
datasysRoute.patch('/:datasysId', updateValidation, (req: Request<{ datasysId: string }>, res: Response, next: NextFunction) => controller.update(req, res, next));

/** GET Busca registro data_sys pelo ID para Excluir/Deletar*/ 
datasysRoute.delete('/:datasysId', (req: Request<{ datasysId: string }>, res: Response, next: NextFunction) => controller.remove(req, res, next));

/** Valida registro data_sys */ 
datasysRoute.post('/', createValidation, (req: Request, res: Response, next: NextFunction) => controller.create(req, res, next));

/** Busca todos registro data_sys */ 
datasysRoute.get('/search', (req, res, next) => controller.search(req, res, next));

////////////////////////////

/** Busca todos registro data_sys */ 
datasysRoute.get('/by-datasys', (req, res, next) => controller.findAll(req, res, next));

/** Busca registro data_sys pelo nome*/ 
datasysRoute.get('/search-name', (req, res, next) => controller.searchByName(req, res, next));

/** Busca registro data_sys pelo chkdb*/ 
datasysRoute.get('/search-chkdb', (req, res, next) => controller.searchByChkdb(req, res, next));

////////////////////////////



export { datasysRoute, data_sysRepository};

