
  import { NextFunction, Request, Response } from 'express';
  import { EmailRepository } from './email.repository';
  import { EmailCreate, EmailUpdate } from './email.dto';
  
  export class EmailController {
    constructor(private readonly emailRepository: EmailRepository) {}
  
    /** POST Cria Tabela Email */
    async create(
      req: Request<{}, {}, EmailCreate>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const email = await this.emailRepository.createEmail(req.body);
        return res.status(201).send({ success: true, email });
      } catch (error) {
        next(error);
      }
    }
  
    /** PATCH Atualiza um registro de Email */
    async update(
      req: Request<{ mailId: string }, {}, Partial<EmailUpdate>>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const mailId = Number(req.params.mailId);
        const email = await this.emailRepository.updateEmail(mailId, req.body);
        return res.status(200).send({ success: true, email });
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
        await this.emailRepository.deleteEmail(mailId);
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
        const emails = await this.emailRepository.findEmailAll();
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
        const email = await this.emailRepository.findEmailById(mailId);
        return res.status(200).send({ success: true, email });
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
        const emails = await this.emailRepository.findEmailAllMail(mail);
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
        const email = await this.emailRepository.findEmailByMail(mail);
        return res.status(200).send({ success: true, email });
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
        const emails = await this.emailRepository.findEmailAllMailresg(mailresg);
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
        const email = await this.emailRepository.findEmailByMailresg(mailresg);
        return res.status(200).send({ success: true, email });
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
        const emails = await this.emailRepository.findEmailByCadastroId(cadastroId);
        return res.status(200).send({ success: true, emails });
      } catch (error) {
        next(error);
      }
    }
  }
  