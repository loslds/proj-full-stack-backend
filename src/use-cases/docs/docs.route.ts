import { Router, Request, Response, NextFunction } from 'express';
import { DocsController } from './docs.controller';
import { DocsRepository } from './docs.repository';
import { dataSource } from '../../database/dataSource';
import { createValidation, updateValidation } from './docs.validation';

const docsRepository = new DocsRepository(dataSource);
const controller = new DocsController(docsRepository);
const docsRoute = Router();

// Rota para listar todos os docs
docsRoute.get('/', (req: Request, res: Response, next: NextFunction) => 
  controller.findAll(req, res, next)
);

// Rota para criar um novo docs
docsRoute.post('/', createValidation, (req: Request, res: Response, next: NextFunction) => 
  controller.create(req, res, next)
);

// Rota para buscar um docs pelo ID
docsRoute.get('/:docsId', (req: Request<{ docsId: string }>, res: Response, next: NextFunction) => 
  controller.getOne(req, res, next)
);

// Rota para atualizar um docs pelo ID
docsRoute.patch('/:docsId', updateValidation, (req: Request<{ docsId: string }>, res: Response, next: NextFunction) => 
  controller.update(req, res, next)
);

// Rota para deletar um docs pelo ID
docsRoute.delete('/:docsId', (req: Request<{ docsId: string }>, res: Response, next: NextFunction) => 
  controller.remove(req, res, next)
);

// Rota para buscar todos os docs por cpf
docsRoute.get('/by-cpf', (req: Request<{}, {}, {}, { cpf: string }>, res: Response, next: NextFunction) => 
  controller.findByCpf(req, res, next)
);

// Rota para buscar todos os docs por cpf (plural)
docsRoute.get('/by-cpfs', (req: Request<{}, {}, {}, { cpf: string }>, res: Response, next: NextFunction) => 
  controller.findAllCpf(req, res, next)
);

// Rota para buscar um docs por cnpj
docsRoute.get('/by-cnpj', (req: Request<{}, {}, {}, { cnpj: string }>, res: Response, next: NextFunction) => 
  controller.findByCnpj(req, res, next)
);

// Rota para buscar todos os docs por cnpj (plural)
docsRoute.get('/by-cnpjs', (req: Request<{}, {}, {}, { cnpj: string }>, res: Response, next: NextFunction) => 
  controller.findAllCnpj(req, res, next)
);

// Rota para buscar um docs por inscre
docsRoute.get('/by-inscre', (req: Request<{}, {}, {}, { inscre: string }>, res: Response, next: NextFunction) => 
  controller.findByInscre(req, res, next)
);

// Rota para buscar todos os docs por inscre (plural)
docsRoute.get('/by-inscres', (req: Request<{}, {}, {}, { inscre: string }>, res: Response, next: NextFunction) => 
  controller.findAllInscre(req, res, next)
);


// Rota para buscar um docs por inscrm
docsRoute.get('/by-inscrm', (req: Request<{}, {}, {}, { inscrm: string }>, res: Response, next: NextFunction) => 
  controller.findByInscrm(req, res, next)
);

// Rota para buscar todos os docs por inscre (plural)
docsRoute.get('/by-inscrms', (req: Request<{}, {}, {}, { inscrm: string }>, res: Response, next: NextFunction) => 
  controller.findAllInscrm(req, res, next)
);

// Rota para buscar um docs por inscre
docsRoute.get('/by-matricula', (req: Request<{}, {}, {}, { matricula: string }>, res: Response, next: NextFunction) => 
  controller.findByMatric(req, res, next)
);

// Rota para buscar todos os docs por inscre (plural)
docsRoute.get('/by-matriculas', (req: Request<{}, {}, {}, { matricula: string }>, res: Response, next: NextFunction) => 
  controller.findAllMatric(req, res, next)
);

// Rota para buscar docs por cadastrosId
docsRoute.get('/docs/by-cadastros/:cadastrosId', (req: Request<{ cadastrosId: string }>, res: Response, next: NextFunction) => 
  controller.findByCadastrosId(req, res, next)
);

export { docsRoute, docsRepository };
