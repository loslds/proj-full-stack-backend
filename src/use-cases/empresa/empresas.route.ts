
// /use-cases/empresa/empresas.route.ts
import { Router, Request, Response, NextFunction } from 'express';
import { EmpresasController } from './empresas.controller';
import { EmpresasRepository } from './empresas.repository';
import { dbSource } from '../start/dbSource';
import { createValidation, updateValidation } from './empresas.validation';
import { ParsedQs } from 'qs';

interface SearchQuery extends ParsedQs {
  id?: string;
  nome?: string;
  fantasy?: string;
}
const empresasRepository = new EmpresasRepository(dbSource);
const controller = new EmpresasController(empresasRepository);
const empresasRoute = Router();

// Tipagem para a rota de busca
interface SearchQuery {
  id?: string;
  nome?: string;
  fantasy?: string;
}
// pega todos os registros 
empresasRoute.get('/', (req: Request, res: Response, next: NextFunction) => controller.findAll(req, res, next));

// cria nomo registro 
empresasRoute.post('/', createValidation, (req: Request, res: Response, next: NextFunction) => controller.create(req, res, next));

// pega registro setado ID
empresasRoute.get('/:empresasId', (req: Request<{ empresasId: string }>, res: Response, next: NextFunction) => controller.getOne(req, res, next));

// pega o registro setado ID e altera  
empresasRoute.patch('/:empresasId', updateValidation, (req: Request<{ empresasId: string }>, res: Response, next: NextFunction) => controller.update(req, res, next));

// pega o registro setado ID e deleta
empresasRoute.delete('/:empresasId', (req: Request<{ empresasId: string }>, res: Response, next: NextFunction) => controller.remove(req, res, next));

// busca o registro setado por nome 
empresasRoute.get('/by-name', (req: Request<{ nome: string }>, res: Response, next: NextFunction) => controller.findByName(req, res, next));

// busca o registro setado por fantasy
empresasRoute.get('/by-fantasy', (req: Request<{ nome: string }>, res: Response, next: NextFunction) => controller.findByFantasy(req, res, next));

// busca todos registro com mesmo id_pessoa setado
empresasRoute.get('empresas/by-pessoa/:pessoaId', (req, res, next) => controller.findAllByPessoaId(req, res, next));

// 🔎 rota de busca flexível (por id, nome ou fantasy)
empresasRoute.get('/search', (req: Request<{}, {}, {}, SearchQuery>, res: Response, next: NextFunction) => controller.search(req, res, next)
);

export { empresasRoute, empresasRepository };

