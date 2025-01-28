import { Router, Request, Response, NextFunction } from 'express';
import { EmailsController } from './emails.controller';
import { EmailsRepository } from './emails.repository';
import { dataSource } from '../../database/dataSource';
import { createValidation, updateValidation } from './emails.validation';

const emailsRepository = new EmailsRepository(dataSource);
const controller = new EmailsController(emailsRepository);
const emailsRoute = Router();

// Rota para listar todos os e-mails
emailsRoute.get('/', (req: Request, res: Response, next: NextFunction) => 
  controller.findAll(req, res, next)
);

// Rota para criar um novo e-mail
emailsRoute.post('/', createValidation, (req: Request, res: Response, next: NextFunction) => 
  controller.create(req, res, next)
);

// Rota para buscar um e-mail pelo ID
emailsRoute.get('/:mailId', (req: Request<{ mailId: string }>, res: Response, next: NextFunction) => 
  controller.getOne(req, res, next)
);

// Rota para atualizar um e-mail pelo ID
emailsRoute.patch('/:mailId', updateValidation, (req: Request<{ mailId: string }>, res: Response, next: NextFunction) => 
  controller.update(req, res, next)
);

// Rota para deletar um e-mail pelo ID
emailsRoute.delete('/:mailId', (req: Request<{ mailId: string }>, res: Response, next: NextFunction) => 
  controller.remove(req, res, next)
);

// Rota para buscar todos os e-mails por mail
emailsRoute.get('/by-mail', (req: Request<{}, {}, {}, { mail: string }>, res: Response, next: NextFunction) => 
  controller.findByMail(req, res, next)
);

// Rota para buscar todos os e-mails por mail (plural)
emailsRoute.get('/by-mails', (req: Request<{}, {}, {}, { mail: string }>, res: Response, next: NextFunction) => 
  controller.findAllMail(req, res, next)
);

// Rota para buscar todos os e-mails por mailresg (plural)
emailsRoute.get('/by-mailregs', (req: Request<{}, {}, {}, { mailresg: string }>, res: Response, next: NextFunction) => 
  controller.findAllMailresg(req, res, next)
);

// Rota para buscar um e-mail por mailresg
emailsRoute.get('/by-mailresg', (req: Request<{}, {}, {}, { mailresg: string }>, res: Response, next: NextFunction) => 
  controller.findByMailresg(req, res, next)
);

// Rota para buscar e-mails por cadastroId
emailsRoute.get('/email/by-cadastros/:cadastrosId', (req: Request<{ cadastrosId: string }>, res: Response, next: NextFunction) => 
  controller.findByCadastrosId(req, res, next)
);

export { emailsRoute, emailsRepository };
