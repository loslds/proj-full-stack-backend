
import { Router, Request, Response, NextFunction } from 'express';
import { PessoasController } from './pessoas.controller';
import { PessoasRepository } from './pessoas.repository';
import { dataSource } from '../../database/dataSource';
import { createValidation, updateValidation } from './pessoas.validation';

const pessoasRepository = new PessoasRepository(dataSource);
const controller = new PessoasController(pessoasRepository);
const pessoasRoute = Router();

pessoasRoute.get('/', (req: Request, res: Response, next: NextFunction) => controller.findAll(req, res, next));
pessoasRoute.post('/', createValidation, (req: Request, res: Response, next: NextFunction) => controller.create(req, res, next));
pessoasRoute.get('/:pessoasId', (req: Request<{ pessoasId: string }>, res: Response, next: NextFunction) => controller.getOne(req, res, next));
pessoasRoute.patch('/:pessoasId', updateValidation, (req: Request<{ pessoasId: string }>, res: Response, next: NextFunction) => controller.update(req, res, next));
pessoasRoute.delete('/:pessoasId', (req: Request<{ pessoasId: string }>, res: Response, next: NextFunction) => controller.remove(req, res, next));
pessoasRoute.get('/by-nmpessoa', (req: Request<{}, {}, {}, { nmpessoa: string }>, res: Response, next: NextFunction) => controller.findByNmpessoa(req, res, next));
pessoasRoute.get('/by-nmpessoas', (req: Request<{}, {}, {}, { nmpessoa: string }>, res: Response, next: NextFunction) => controller.findAllNmpessoa(req, res, next));
pessoasRoute.get('/by-sigla', (req: Request<{}, {}, {}, { sigla: string }>, res: Response, next: NextFunction) => controller.findBySigla(req, res, next));
pessoasRoute.get('/by-siglas', (req: Request<{}, {}, {}, { sigla: string }>, res: Response, next: NextFunction) => controller.findAllSigla(req, res, next));

export { pessoasRoute, pessoasRepository };
