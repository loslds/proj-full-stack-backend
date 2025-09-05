
// C:\repository\proj-full-stack-backend\src\use-cases\pessoa\pessoas.route.ts
import { dbSource } from '../../database';
import { Router, Request, Response, NextFunction } from 'express';
import { PessoasController } from './pessoas.controller';
import { PessoasRepository } from './pessoas.repository';
import { createValidation, updateValidation } from './pessoas.validation';

const pessoasRepository = new PessoasRepository(dbSource);
const controller = new PessoasController(pessoasRepository);
const pessoasRoute = Router();

pessoasRoute.get('/', (req: Request, res: Response, next: NextFunction) => controller.findAll(req, res, next));
pessoasRoute.get('/:pessoasId', (req: Request<{ pessoasId: string }>, res: Response, next: NextFunction) => controller.getOne(req, res, next));
pessoasRoute.post('/', createValidation, (req: Request, res: Response, next: NextFunction) => controller.create(req, res, next));
pessoasRoute.patch('/:pessoasId', updateValidation, (req: Request<{ pessoasId: string }>, res: Response, next: NextFunction) => controller.update(req, res, next));
pessoasRoute.delete('/:pessoasId', (req: Request<{ pessoasId: string }>, res: Response, next: NextFunction) => controller.remove(req, res, next));
pessoasRoute.get('/search', (req, res, next) => controller.search(req, res, next));
/////////////////////////////
pessoasRoute.get('/search-name', (req, res, next) => controller.searchByName(req, res, next));
pessoasRoute.get('/search-sigla', (req, res, next) => controller.searchBySigla(req, res, next));
pessoasRoute.get('/one-nome', (req, res, next) => controller.findOneNome(req, res, next));
pessoasRoute.get('/all-nome', (req, res, next) => controller.findAllNome(req, res, next));
pessoasRoute.get('/one-sigla', (req, res, next) => controller.findOneSigla(req, res, next));
pessoasRoute.get('/all-sigla', (req, res, next) => controller.findAllSigla(req, res, next));

export { pessoasRoute, pessoasRepository };

