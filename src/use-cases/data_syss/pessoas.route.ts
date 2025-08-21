
import { Router, Request, Response, NextFunction } from 'express';
import { PessoasController } from './data_sys.controller';
import { PessoasRepository } from './data_sys.repository';
import { dataSource } from '../../database/dataSource';
import { createValidation, updateValidation } from './pessoas.validation';

const pessoasRepository = new PessoasRepository(dataSource);
const controller = new PessoasController(pessoasRepository);
const pessoasRoute = Router();

pessoasRoute.get('/', (req: Request, res: Response, next: NextFunction) => controller.findAll(req, res, next));
pessoasRoute.get('/:pessoasId', (req: Request<{ pessoasId: string }>, res: Response, next: NextFunction) => controller.getOne(req, res, next));
pessoasRoute.patch('/:pessoasId', updateValidation, (req: Request<{ pessoasId: string }>, res: Response, next: NextFunction) => controller.update(req, res, next));
pessoasRoute.delete('/:pessoasId', (req: Request<{ pessoasId: string }>, res: Response, next: NextFunction) => controller.remove(req, res, next));
pessoasRoute.post('/', createValidation, (req: Request, res: Response, next: NextFunction) => controller.create(req, res, next));
pessoasRoute.get('/search', (req, res, next) => controller.search(req, res, next));
////////////////////////////
pessoasRoute.get('/by-nmpessoa', (req, res, next) => controller.findByNmpessoa(req, res, next));
pessoasRoute.get('/search-name', (req, res, next) => controller.searchByName(req, res, next));
pessoasRoute.get('/search-sigla', (req, res, next) => controller.searchBySigla(req, res, next));
////////////////////////////




export { pessoasRoute, pessoasRepository };
