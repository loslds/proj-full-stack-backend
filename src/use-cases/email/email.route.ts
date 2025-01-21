import { Router, Request, Response, NextFunction } from 'express';
import { EmailController } from './email.controller';
import { EmailRepository } from './email.repository';
import { dataSource } from '../../database/dataSource';
import { createValidation, updateValidation } from './mail.validation';

const emailRepository = new EmailRepository(dataSource);
const controller = new EmailController(emailRepository);
const emailRoute = Router();

// Rota para listar todos os e-mails
emailRoute.get('/', (req: Request, res: Response, next: NextFunction) => 
  controller.findAll(req, res, next)
);

// Rota para criar um novo e-mail
emailRoute.post('/', createValidation, (req: Request, res: Response, next: NextFunction) => 
  controller.create(req, res, next)
);

// Rota para buscar um e-mail pelo ID
emailRoute.get('/:mailId', (req: Request<{ mailId: string }>, res: Response, next: NextFunction) => 
  controller.getOne(req, res, next)
);

// Rota para atualizar um e-mail pelo ID
emailRoute.patch('/:mailId', updateValidation, (req: Request<{ mailId: string }>, res: Response, next: NextFunction) => 
  controller.update(req, res, next)
);

// Rota para deletar um e-mail pelo ID
emailRoute.delete('/:mailId', (req: Request<{ mailId: string }>, res: Response, next: NextFunction) => 
  controller.remove(req, res, next)
);

// Rota para buscar todos os e-mails por mail
emailRoute.get('/by-mail', (req: Request<{}, {}, {}, { mail: string }>, res: Response, next: NextFunction) => 
  controller.findByMail(req, res, next)
);

// Rota para buscar todos os e-mails por mail (plural)
emailRoute.get('/by-mails', (req: Request<{}, {}, {}, { mail: string }>, res: Response, next: NextFunction) => 
  controller.findAllMail(req, res, next)
);

// Rota para buscar todos os e-mails por mailresg (plural)
emailRoute.get('/by-mailregs', (req: Request<{}, {}, {}, { mailresg: string }>, res: Response, next: NextFunction) => 
  controller.findAllMailresg(req, res, next)
);

// Rota para buscar um e-mail por mailresg
emailRoute.get('/by-mailresg', (req: Request<{}, {}, {}, { mailresg: string }>, res: Response, next: NextFunction) => 
  controller.findByMailresg(req, res, next)
);

// Rota para buscar e-mails por cadastroId
emailRoute.get('/email/by-cadastro/:cadastroId', (req: Request<{ cadastroId: string }>, res: Response, next: NextFunction) => 
  controller.findByCadastroId(req, res, next)
);

export { emailRoute, emailRepository };
