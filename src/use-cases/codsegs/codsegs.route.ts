import { Router, Request, Response, NextFunction } from 'express';
import { CodsegsController } from './codsegs.controller';
import { CodsegsRepository } from './codsegs.repository';
import { dataSource } from '../../database/dataSource';
import { createValidation, updateValidation } from './codsegs.validation';

const codsegsRepository = new CodsegsRepository(dataSource);
const controller = new CodsegsController(codsegsRepository);
const codsegsRoute = Router();

// Rota para listar todos os codsegs
codsegsRoute.get('/', (req: Request, res: Response, next: NextFunction) => 
  controller.findAll(req, res, next)
);

// Rota para criar um novo codsegs
codsegsRoute.post('/', createValidation, (req: Request, res: Response, next: NextFunction) => 
  controller.create(req, res, next)
);

// Rota para buscar um codsegs pelo ID
codsegsRoute.get('/:codsegsId', (req: Request<{ codsegsId: string }>, res: Response, next: NextFunction) => 
  controller.getOne(req, res, next)
);

// Rota para atualizar um codsegs pelo ID
codsegsRoute.patch('/:codsegsId', updateValidation, (req: Request<{ codsegsId: string }>, res: Response, next: NextFunction) => 
  controller.update(req, res, next)
);

// Rota para deletar um documento pelo ID
codsegsRoute.delete('/:codsegsId', (req: Request<{ codsegsId: string }>, res: Response, next: NextFunction) => 
  controller.remove(req, res, next)
);

// Rota para buscar todos os codsegs por codigo
codsegsRoute.get('/by-codigo', (req: Request<{}, {}, {}, { codigo: string }>, res: Response, next: NextFunction) => 
  controller.findByCodigo(req, res, next)
);

// Rota para buscar documento por cadastroId
codsegsRoute.get('/codsegs/by-cadastro/:cadastroId', (req: Request<{ cadastroId: string }>, res: Response, next: NextFunction) => 
  controller.findByCadastroId(req, res, next)
);

export { codsegsRoute, codsegsRepository };
