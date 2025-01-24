
import { Router, Request, Response, NextFunction } from 'express';
import { PessoaController } from './pessoa.controller';
import { PessoaRepository } from './pessoa.repository';
import { dataSource } from '../../database/dataSource';
import { createValidation, updateValidation } from './pessoa.validation';

const pessoaRepository = new PessoaRepository(dataSource);
const controller = new PessoaController(pessoaRepository);
const pessoaRoute = Router();

pessoaRoute.get('/', (req: Request, res: Response, next: NextFunction) => controller.findAll(req, res, next));
pessoaRoute.post('/', createValidation, (req: Request, res: Response, next: NextFunction) => controller.create(req, res, next));
pessoaRoute.get('/:pessoaId', (req: Request<{ pessoaId: string }>, res: Response, next: NextFunction) => controller.getOne(req, res, next));
pessoaRoute.patch('/:pessoaId', updateValidation, (req: Request<{ pessoaId: string }>, res: Response, next: NextFunction) => controller.update(req, res, next));
pessoaRoute.delete('/:pessoaId', (req: Request<{ pessoaId: string }>, res: Response, next: NextFunction) => controller.remove(req, res, next));
pessoaRoute.get('/by-nmpessoa', (req: Request<{}, {}, {}, { nmpessoa: string }>, res: Response, next: NextFunction) => controller.findByNmpessoa(req, res, next));
pessoaRoute.get('/by-nmpessoas', (req: Request<{}, {}, {}, { nmpessoa: string }>, res: Response, next: NextFunction) => controller.findAllNmpessoa(req, res, next));
pessoaRoute.get('/by-sigla', (req: Request<{}, {}, {}, { sigla: string }>, res: Response, next: NextFunction) => controller.findBySigla(req, res, next));
pessoaRoute.get('/by-siglas', (req: Request<{}, {}, {}, { sigla: string }>, res: Response, next: NextFunction) => controller.findAllSigla(req, res, next));

export { pessoaRoute, pessoaRepository };
