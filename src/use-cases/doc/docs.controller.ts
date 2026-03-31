
// C:\repository\proj-full-stack-backend\src\use-cases\doc\docs.controller.ts
import { NextFunction, Request, Response } from 'express';
import { DocsRepository } from './docs.repository';
import { DocsCreate, DocsUpdate } from './docs.dto';
import { HttpException } from '../../exceptions/HttpException';

export class DocsController {
  constructor(private readonly docsRepository: DocsRepository) {}

  // ============================================================
  // * CRUD *
  // ============================================================

  /** POST → Criar novo documento */
  async createNewDocs(
    req: Request<{}, {}, DocsCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id_cadastros } = req.body;

      if (!id_cadastros) {
        throw new HttpException(400, 'id_cadastros é obrigatório');
      }

      const docs = await this.docsRepository.createDocs(req.body);

      return res.status(201).send({
        success: true,
        docs
      });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH → Atualizar documento */
  async updateIdDocs(
    req: Request<{ docsId: string }, {}, DocsUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const docsId = Number(req.params.docsId);

      if (Number.isNaN(docsId) || docsId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const docs = await this.docsRepository.updateDocsId(
        docsId,
        req.body
      );

      return res.status(200).send({
        success: true,
        docs
      });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE → Remover documento */
  async removeIdDocs(
    req: Request<{ docsId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const docsId = Number(req.params.docsId);

      if (Number.isNaN(docsId) || docsId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      await this.docsRepository.deleteDocsId(docsId);

      return res.status(200).send({
        success: true,
        message: `Documento ID ${docsId} removido com sucesso.`
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar por ID */
  async getOneDocsId(
    req: Request<{ docsId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const docsId = Number(req.params.docsId);

      if (Number.isNaN(docsId) || docsId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const docs = await this.docsRepository.findOneDocsById(docsId);

      if (!docs) {
        throw new HttpException(404, `Documento ID ${docsId} não encontrado.`);
      }

      return res.status(200).send({
        success: true,
        docs
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista todos */
  async findAllDocs(req: Request, res: Response, next: NextFunction) {
    try {
      const docs = await this.docsRepository.findDocsAll(
        undefined,
        { id: 'ASC' }
      );

      return res.status(200).send({
        success: true,
        docs
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // * CONSULTAS *
  // ============================================================

  /** GET → Pesquisa combinada */
  async searchDocsAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        id,
        id_cadastros,
        cpf,
        cnpj,
        inscr_estadual,
        inscr_municipal
      } = req.query;

      const docs = await this.docsRepository.searchDocs({
        id: id !== undefined ? Number(id) : undefined,
        id_cadastros:
          id_cadastros !== undefined ? Number(id_cadastros) : undefined,
        cpf: cpf !== undefined ? String(cpf) : undefined,
        cnpj: cnpj !== undefined ? String(cnpj) : undefined,
        inscr_estadual:
          inscr_estadual !== undefined
            ? String(inscr_estadual)
            : undefined,
        inscr_municipal:
          inscr_municipal !== undefined
            ? String(inscr_municipal)
            : undefined
      });

      return res.status(200).send({
        success: true,
        docs
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca parcial */
  async searchDocsParcial(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text =
        req.query.text !== undefined ? String(req.query.text) : undefined;

      const docs = await this.docsRepository.searchDocsParcial(text);

      return res.status(200).send({
        success: true,
        docs
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → CPF exato */
  async findOneDocsCpf(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cpf =
        req.query.cpf !== undefined ? String(req.query.cpf) : undefined;

      if (!cpf) {
        throw new HttpException(400, "Parâmetro 'cpf' é obrigatório");
      }

      const docs = await this.docsRepository.findOneDocsCpf(cpf);

      return res.status(200).send({
        success: true,
        docs
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Todos CPF */
  async findAllDocsCpf(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cpf =
        req.query.cpf !== undefined ? String(req.query.cpf) : undefined;

      if (!cpf) {
        throw new HttpException(400, "Parâmetro 'cpf' é obrigatório");
      }

      const docs = await this.docsRepository.findAllDocsCpf(cpf);

      return res.status(200).send({
        success: true,
        total: docs.length,
        docs
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → CNPJ exato */
  async findOneDocsCnpj(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cnpj =
        req.query.cnpj !== undefined ? String(req.query.cnpj) : undefined;

      if (!cnpj) {
        throw new HttpException(400, "Parâmetro 'cnpj' é obrigatório");
      }

      const docs = await this.docsRepository.findOneDocsCnpj(cnpj);

      return res.status(200).send({
        success: true,
        docs
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Todos CNPJ */
  async findAllDocsCnpj(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cnpj =
        req.query.cnpj !== undefined ? String(req.query.cnpj) : undefined;

      if (!cnpj) {
        throw new HttpException(400, "Parâmetro 'cnpj' é obrigatório");
      }

      const docs = await this.docsRepository.findAllDocsCnpj(cnpj);

      return res.status(200).send({
        success: true,
        total: docs.length,
        docs
      });
    } catch (error) {
      next(error);
    }
  }
////////////////////////////////////////////////
  /** GET → Inscr_Estadual exato */
  async findOneDocsByInscrEstadual(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const inscr_estadual =
        req.query.inscr_estadual !== undefined ? String(req.query.inscr_estadual) : undefined;

      if (!inscr_estadual) {
        throw new HttpException(400, "Parâmetro 'inscr_estadual' é obrigatório");
      }

      const docs = await this.docsRepository.findOneDocsInscrEstadual(inscr_estadual);

      return res.status(200).send({
        success: true,
        docs
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Todos Inscr_Estadual */
  async findAllDocsByInscrEstadual(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const inscr_estadual =
        req.query.inscr_estadual !== undefined ? String(req.query.inscr_estadual) : undefined;

      if (!inscr_estadual) {
        throw new HttpException(400, "Parâmetro 'inscr_estadual' é obrigatório");
      }

      const docs = await this.docsRepository.findAllDocsInscrEstadual(inscr_estadual);

      return res.status(200).send({
        success: true,
        total: docs.length,
        docs
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Inscr_Estadual exato */
  async findOneDocsByInscrMunicipal(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const inscr_municipal =
        req.query.inscr_municipal !== undefined ? String(req.query.inscr_municipal) : undefined;

      if (!inscr_municipal) {
        throw new HttpException(400, "Parâmetro 'inscr_municipal' é obrigatório");
      }

      const docs = await this.docsRepository.findOneDocsInscrMunicipal(inscr_municipal);

      return res.status(200).send({
        success: true,
        docs
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Todos Inscr_Municipal */
  async findAllDocsByInscrMunicipal(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const inscr_municipal =
        req.query.inscr_municipal !== undefined ? String(req.query.inscr_municipal) : undefined;

      if (!inscr_municipal) {
        throw new HttpException(400, "Parâmetro 'inscr_municipal' é obrigatório");
      }

      const docs = await this.docsRepository.findAllDocsInscrMunicipal(inscr_municipal);

      return res.status(200).send({
        success: true,
        total: docs.length,
        docs
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Por cadastro */
  async findAllDocsCadastrosId(
    req: Request<{ cadastrosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cadastrosId = Number(req.params.cadastrosId);

      if (Number.isNaN(cadastrosId) || cadastrosId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const docs =
        await this.docsRepository.findAllDocsByCadastrosId(cadastrosId);

      return res.status(200).send({
        success: true,
        total: docs.length,
        docs
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Details */
  async listAllDocsDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const docs = await this.docsRepository.listAllDocsDetails();

      return res.status(200).send({
        success: true,
        docs
      });
    } catch (error) {
      next(error);
    }
  }
}


  