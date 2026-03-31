
// C:\repository\proj-full-stack-backend\src\use-cases\email\emails.controller.ts
import { NextFunction, Request, Response } from 'express';
import { EmailsRepository } from './emails.repository';
import { EmailsCreate, EmailsUpdate } from './emails.dto';
import { HttpException } from '../../exceptions/HttpException';

export class EmailsController {
  constructor(private readonly emailsRepository: EmailsRepository) {}

  // ============================================================
  // * CRUD *
  // ============================================================

  /** POST → Criar novo email */
  async createNewEmails(
    req: Request<{}, {}, EmailsCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id_cadastros, email } = req.body;

      if (!id_cadastros || !email) {
        throw new HttpException(
          400,
          'id_cadastros e email são obrigatórios'
        );
      }

      const duplicated = await this.emailsRepository.hasDuplicatedEmail(
        email.trim()
      );

      if (duplicated) {
        throw new HttpException(409, 'Email já cadastrado!');
      }

      const emails = await this.emailsRepository.createEmails(req.body);

      return res.status(201).send({
        success: true,
        emails
      });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH → Atualizar email pelo ID */
  async updateIdEmails(
    req: Request<{ emailsId: string }, {}, EmailsUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const emailsId = Number(req.params.emailsId);

      if (Number.isNaN(emailsId) || emailsId <= 0) {
        throw new HttpException(400, 'ID do email inválido');
      }

      if (req.body.email) {
        const duplicated = await this.emailsRepository.hasDuplicatedEmail(
          req.body.email.trim(),
          [emailsId]
        );

        if (duplicated) {
          throw new HttpException(409, 'Email já cadastrado!');
        }
      }

      const emails = await this.emailsRepository.updateEmailsId(
        emailsId,
        req.body
      );

      return res.status(200).send({
        success: true,
        emails
      });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE → Remover email */
  async removeIdEmails(
    req: Request<{ emailsId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const emailsId = Number(req.params.emailsId);

      if (Number.isNaN(emailsId) || emailsId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      await this.emailsRepository.deleteEmailsId(emailsId);

      return res.status(200).send({
        success: true,
        message: `Email ID ${emailsId} removido com sucesso.`
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar email pelo ID */
  async getOneEmailsId(
    req: Request<{ emailsId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const emailsId = Number(req.params.emailsId);

      if (Number.isNaN(emailsId) || emailsId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const emails = await this.emailsRepository.findOneEmailsById(emailsId);

      if (!emails) {
        throw new HttpException(404, `Email ID ${emailsId} não encontrado.`);
      }

      return res.status(200).send({
        success: true,
        emails
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista todos os emails */
  async findAllEmails(req: Request, res: Response, next: NextFunction) {
    try {
      const emails = await this.emailsRepository.findEmailsAll(
        undefined,
        { id: 'ASC' }
      );

      return res.status(200).send({
        success: true,
        emails
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // * CONSULTAS *
  // ============================================================

  /** GET → Pesquisa combinada */
  async searchEmailsAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id, email, email_resgate, id_cadastros } = req.query;

      const emails = await this.emailsRepository.searchEmails({
        id: id !== undefined ? Number(id) : undefined,
        email: email !== undefined ? String(email) : undefined,
        email_resgate:
          email_resgate !== undefined ? String(email_resgate) : undefined,
        id_cadastros:
          id_cadastros !== undefined ? Number(id_cadastros) : undefined
      });

      return res.status(200).send({
        success: true,
        emails
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca parcial por text */
  async searchEmailsParcial(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text =
        req.query.text !== undefined ? String(req.query.text) : undefined;

      const emails = await this.emailsRepository.searchEmailsParcial(text);

      return res.status(200).send({
        success: true,
        emails
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca um email exato */
  async findOneEmailsEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const email =
        req.query.email !== undefined ? String(req.query.email) : undefined;

      if (!email) {
        throw new HttpException(400, "Parâmetro 'email' é obrigatório");
      }

      const emails = await this.emailsRepository.findOneEmailsEmail(email);

      return res.status(200).send({
        success: true,
        emails
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca todos os emails exatos */
  async findAllEmailsEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const email =
        req.query.email !== undefined ? String(req.query.email) : undefined;

      if (!email) {
        throw new HttpException(400, "Parâmetro 'email' é obrigatório");
      }

      const emails = await this.emailsRepository.findAllEmailsEmail(email);

      return res.status(200).send({
        success: true,
        total: emails.length,
        emails
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca um email_resgate exato */
  async findOneEmailsEmailResgate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const email_resgate =
        req.query.email_resgate !== undefined
          ? String(req.query.email_resgate)
          : undefined;

      if (!email_resgate) {
        throw new HttpException(
          400,
          "Parâmetro 'email_resgate' é obrigatório"
        );
      }

      const emails =
        await this.emailsRepository.findOneEmailsEmailResgate(email_resgate);

      return res.status(200).send({
        success: true,
        emails
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca todos os email_resgate exatos */
  async findAllEmailsEmailResgate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const email_resgate =
        req.query.email_resgate !== undefined
          ? String(req.query.email_resgate)
          : undefined;

      if (!email_resgate) {
        throw new HttpException(
          400,
          "Parâmetro 'email_resgate' é obrigatório"
        );
      }

      const emails =
        await this.emailsRepository.findAllEmailsEmailResgate(email_resgate);

      return res.status(200).send({
        success: true,
        total: emails.length,
        emails
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca todos os emails por cadastro */
  async findAllEmailsCadastrosId(
    req: Request<{ cadastrosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cadastrosId = Number(req.params.cadastrosId);

      if (Number.isNaN(cadastrosId) || cadastrosId <= 0) {
        throw new HttpException(400, 'ID do cadastro inválido');
      }

      const emails =
        await this.emailsRepository.findAllEmailsByCadastrosId(cadastrosId);

      return res.status(200).send({
        success: true,
        total: emails.length,
        emails
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista emails com details */
  async listAllEmailsDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const emails = await this.emailsRepository.listAllEmailsDetails();

      return res.status(200).send({
        success: true,
        emails
      });
    } catch (error) {
      next(error);
    }
  }
}