
  import { NextFunction, Request, Response } from 'express';
  import { EmailsRepository } from './emails.repository';
  import { EmailsCreate, EmailsUpdate } from './emails.dto';
  
  export class EmailsController {
    constructor(private readonly emailsRepository: EmailsRepository) {}
  
    /** POST Cria Tabela Email */
    async create(
      req: Request<{}, {}, EmailsCreate>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const emails = await this.emailsRepository.createEmails(req.body);
        return res.status(201).send({ success: true, emails });
      } catch (error) {
        next(error);
      }
    }
  
    /** PATCH Atualiza um registro de Emails */
    async update(
      req: Request<{ mailId: string }, {}, Partial<EmailsUpdate>>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const mailId = Number(req.params.mailId);
        const emails = await this.emailsRepository.updateEmail(mailId, req.body);
        return res.status(200).send({ success: true, emails });
      } catch (error) {
        next(error);
      }
    }
  
    /** DELETE Remove um registro de Email */
    async remove(
      req: Request<{ mailId: string }>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const mailId = Number(req.params.mailId);
        await this.emailsRepository.deleteEmail(mailId);
        return res.status(200).send({ success: true });
      } catch (error) {
        next(error);
      }
    }
  
    /** GET Lista todos os registros de Email */
    async findAll(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const emails = await this.emailsRepository.findEmailAll();
        return res.status(200).send({ success: true, emails });
      } catch (error) {
        next(error);
      }
    }
  
    /** GET Busca um registro de Email por ID */
    async getOne(
      req: Request<{ mailId: string }>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const mailId = Number(req.params.mailId);
        const emails = await this.emailsRepository.findEmailById(mailId);
        return res.status(200).send({ success: true, emails });
      } catch (error) {
        next(error);
      }
    }
  
    /** GET Lista todos os registros de Email por mail */
    async findAllMail(
      req: Request<{}, {}, {}, { mail: string }>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const { mail } = req.query;
        if (!mail) {
          return res.status(400).send({ success: false, message: 'mail parameter is required' });
        }
        const emails = await this.emailsRepository.findEmailAllMail(mail);
        return res.status(200).send({ success: true, emails });
      } catch (error) {
        next(error);
      }
    }
  
    /** GET Busca um registro de Email por mail */
    async findByMail(
      req: Request<{}, {}, {}, { mail: string }>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const { mail } = req.query;
        if (!mail) {
          return res.status(400).send({ success: false, message: 'mail parameter is required' });
        }
        const emails = await this.emailsRepository.findEmailByMail(mail);
        return res.status(200).send({ success: true, emails });
      } catch (error) {
        next(error);
      }
    }
  
    /** GET Lista todos os registros de Email por mailresg */
    async findAllMailresg(
      req: Request<{}, {}, {}, { mailresg: string }>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const { mailresg } = req.query;
        if (!mailresg) {
          return res.status(400).send({ success: false, message: 'mailresg parameter is required' });
        }
        const emails = await this.emailsRepository.findEmailAllMailresg(mailresg);
        return res.status(200).send({ success: true, emails });
      } catch (error) {
        next(error);
      }
    }
  
    /** GET Busca um registro de Email por mailresg */
    async findByMailresg(
      req: Request<{}, {}, {}, { mailresg: string }>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const { mailresg } = req.query;
        if (!mailresg) {
          return res.status(400).send({ success: false, message: 'mailresg parameter is required' });
        }
        const emails = await this.emailsRepository.findEmailByMailresg(mailresg);
        return res.status(200).send({ success: true, emails });
      } catch (error) {
        next(error);
      }
    }
  
    /** GET Lista todos os registros de Email por cadastroId */
    async findByCadastroId(
      req: Request<{ cadastroId: string }>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const cadastroId = Number(req.params.cadastroId);
        const emails = await this.emailsRepository.findEmailByCadastroId(cadastroId);
        return res.status(200).send({ success: true, emails });
      } catch (error) {
        next(error);
      }
    }
  }
  