
import { Router, Request, Response, NextFunction } from 'express';
import { SystableController } from './systable.controller';
import { SystableRepository } from './systable.repository';
import { dbSource } from '../start/dbSource';
import { createValidation, updateValidation } from './systables.validation';

const systableRepository = new SystableRepository(dbSource);
const controller = new SystableController(systableRepository);
const systableRoute = Router();

systableRoute.get('/', (req, res, next) => controller.findAll(req, res, next));

systableRoute.post('/', createValidation, (req, res, next) => controller.create(req, res, next));

systableRoute.get('/:systableId', (req, res, next) => controller.getOne(req, res, next));


/** GET Busca todos os registros de systable */ 
systableRoute.get('/', (req: Request, res: Response, next: NextFunction) => controller.findAll(req, res, next));

/** GET Busca registro data_sys pelo ID */ 
systableRoute.get('/:systableId', (req: Request<{ systableId: string }>, res: Response, next: NextFunction) => controller.getOne(req, res, next));

/** GET Busca registro systable pelo ID para Alterar*/ 
systableRoute.patch('/:systableId', updateValidation, (req: Request<{ systableId: string }>, res: Response, next: NextFunction) => controller.update(req, res, next));

/** GET Busca registro data_sys pelo ID para Excluir/Deletar*/ 
systableRoute.delete('/:systableId', (req: Request<{ systableId: string }>, res: Response, next: NextFunction) => controller.remove(req, res, next));

/** Valida registro systable */ 
systableRoute.post('/', createValidation, (req: Request, res: Response, next: NextFunction) => controller.create(req, res, next));

/** Busca todos registro systable */ 
systableRoute.get('/search', (req, res, next) => controller.search(req, res, next));

////////////////////////////

/** Busca todos registro systable */ 
systableRoute.get('/by-systable', (req, res, next) => controller.findAll(req, res, next));

/** Busca registro systable pelo nome*/ 
systableRoute.get('/search-name', (req, res, next) => controller.searchByName(req, res, next));

/** Busca registro systable pelo chkdb*/ 
systableRoute.get('/search-chkdb', (req, res, next) => controller.searchByChkdb(req, res, next));

////////////////////////////



export { systableRoute, systableRepository};

