
import { Router, Request, Response, NextFunction } from 'express';
import { SystableController } from './systable.controller';
import { SystableRepository } from './systable.repository';
import { dbSource } from '../start/dbSource';
import { createValidation, updateValidation } from './systables.validation';

const systablesRepository = new SystableRepository(dbSource);
const controller = new SystableController(systablesRepository);
const systablesRoute = Router();

systablesRoute.get('/', (req, res, next) => controller.findAll(req, res, next));

systablesRoute.post('/', createValidation, (req, res, next) => controller.create(req, res, next));

systablesRoute.get('/:datasysId', (req, res, next) => controller.getOne(req, res, next));


/** GET Busca todos os registros de data_sys */ 
systablesRoute.get('/', (req: Request, res: Response, next: NextFunction) => controller.findAll(req, res, next));

/** GET Busca registro data_sys pelo ID */ 
systablesRoute.get('/:datasysId', (req: Request<{ datasysId: string }>, res: Response, next: NextFunction) => controller.getOne(req, res, next));

/** GET Busca registro data_sys pelo ID para Alterar*/ 
systablesRoute.patch('/:datasysId', updateValidation, (req: Request<{ datasysId: string }>, res: Response, next: NextFunction) => controller.update(req, res, next));

/** GET Busca registro data_sys pelo ID para Excluir/Deletar*/ 
systablesRoute.delete('/:datasysId', (req: Request<{ datasysId: string }>, res: Response, next: NextFunction) => controller.remove(req, res, next));

/** Valida registro data_sys */ 
systablesRoute.post('/', createValidation, (req: Request, res: Response, next: NextFunction) => controller.create(req, res, next));

/** Busca todos registro data_sys */ 
systablesRoute.get('/search', (req, res, next) => controller.search(req, res, next));

////////////////////////////

/** Busca todos registro data_sys */ 
systablesRoute.get('/by-datasys', (req, res, next) => controller.findAll(req, res, next));

/** Busca registro data_sys pelo nome*/ 
systablesRoute.get('/search-name', (req, res, next) => controller.searchByName(req, res, next));

/** Busca registro data_sys pelo chkdb*/ 
systablesRoute.get('/search-chkdb', (req, res, next) => controller.searchByChkdb(req, res, next));

////////////////////////////



export { systablesRoute, systablesRepository};

