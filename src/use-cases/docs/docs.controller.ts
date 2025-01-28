
  import { NextFunction, Request, Response } from 'express';
  import { DocsRepository } from './docs.repository';
  import { DocsCreate, DocsUpdate } from './docs.dto';
  
  export class DocsController {
    constructor(private readonly docsRepository: DocsRepository) {}
  
    /** POST Cria Tabela Docs */
    async create(
      req: Request<{}, {}, DocsCreate>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const docs = await this.docsRepository.createDocs(req.body);
        return res.status(201).send({ success: true, docs });
      } catch (error) {
        next(error);
      }
    }
  
    /** PATCH Atualiza um registro de Docs */
    async update(
      req: Request<{ docsId: string }, {}, Partial<DocsUpdate>>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const docsId = Number(req.params.docsId);
        const docs = await this.docsRepository.updateDocs(docsId, req.body);
        return res.status(200).send({ success: true, docs });
      } catch (error) {
        next(error);
      }
    }
  
    /** DELETE Remove um registro de Docs */
    async remove(
      req: Request<{ docsId: string }>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const docsId = Number(req.params.docsId);
        await this.docsRepository.deleteDocs(docsId);
        return res.status(200).send({ success: true });
      } catch (error) {
        next(error);
      }
    }
  
    /** GET Lista todos os registros de Docs */
    async findAll(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const docs = await this.docsRepository.findDocsAll();
        return res.status(200).send({ success: true, docs });
      } catch (error) {
        next(error);
      }
    }
  
    /** GET Busca um registro de Docs por ID */
    async getOne(
      req: Request<{ docsId: string }>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const docsId = Number(req.params.docsId);
        const docs = await this.docsRepository.findDocsById(docsId);
        return res.status(200).send({ success: true, docs });
      } catch (error) {
        next(error);
      }
    }
  
    /** GET Lista todos os registros de Docs por cpf */
    async findAllCpf(
      req: Request<{}, {}, {}, { cpf: string }>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const { cpf } = req.query;
        if (!cpf) {
          return res.status(400).send({ success: false, message: 'cpf parameter is required' });
        }
        const docs = await this.docsRepository.findDocsAllCpf(cpf);
        return res.status(200).send({ success: true, docs });
      } catch (error) {
        next(error);
      }
    }
  
    /** GET Busca um registro de Docs por cpf */
    async findByCpf(
      req: Request<{}, {}, {}, { cpf: string }>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const { cpf } = req.query;
        if (!cpf) {
          return res.status(400).send({ success: false, message: 'cpf parameter is required' });
        }
        const docs = await this.docsRepository.findDocsByCpf(cpf);
        return res.status(200).send({ success: true, docs });
      } catch (error) {
        next(error);
      }
    }
  
    /** GET Lista todos os registros de Docs por cnpj */
    async findAllCnpj(
      req: Request<{}, {}, {}, { cnpj: string }>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const { cnpj } = req.query;
        if (!cnpj) {
          return res.status(400).send({ success: false, message: 'cnpj parameter is required' });
        }
        const docs = await this.docsRepository.findDocsAllCnpj(cnpj);
        return res.status(200).send({ success: true, docs });
      } catch (error) {
        next(error);
      }
    }
  
    /** GET Busca um registro de Docs por cnpj */
    async findByCnpj(
      req: Request<{}, {}, {}, { cnpj: string }>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const { cnpj } = req.query;
        if (!cnpj) {
          return res.status(400).send({ success: false, message: 'cnpj parameter is required' });
        }
        const docs = await this.docsRepository.findDocsByCnpj(cnpj);
        return res.status(200).send({ success: true, docs });
      } catch (error) {
        next(error);
      }
    }
    
    /** GET Lista todos os registros de Docs por inscre */
    async findAllInscre(
      req: Request<{}, {}, {}, { inscre: string }>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const { inscre } = req.query;
        if (!inscre) {
          return res.status(400).send({ success: false, message: 'inscre parameter is required' });
        }
        const docs = await this.docsRepository.findDocsAllInscre(inscre);
        return res.status(200).send({ success: true, docs });
      } catch (error) {
        next(error);
      }
    }
  
    /** GET Busca um registro de Email por inscre */
    async findByInscre(
      req: Request<{}, {}, {}, { inscre: string }>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const { inscre } = req.query;
        if (!inscre) {
          return res.status(400).send({ success: false, message: 'inscre parameter is required' });
        }
        const docs = await this.docsRepository.findDocsByInscre(inscre);
        return res.status(200).send({ success: true, docs });
      } catch (error) {
        next(error);
      }
    }
  
    /** GET Lista todos os registros de Docs por inscrm */
    async findAllInscrm(
      req: Request<{}, {}, {}, { inscrm: string }>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const { inscrm } = req.query;
        if (!inscrm) {
          return res.status(400).send({ success: false, message: 'inscrm parameter is required' });
        }
        const docs = await this.docsRepository.findDocsAllInscre(inscrm);
        return res.status(200).send({ success: true, docs });
      } catch (error) {
        next(error);
      }
    }
  
    /** GET Busca um registro de Email por inscrm */
    async findByInscrm(
      req: Request<{}, {}, {}, { inscrm: string }>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const { inscrm } = req.query;
        if (!inscrm) {
          return res.status(400).send({ success: false, message: 'inscrm parameter is required' });
        }
        const docs = await this.docsRepository.findDocsByInscre(inscrm);
        return res.status(200).send({ success: true, docs });
      } catch (error) {
        next(error);
      }
    }
  
    
    /** GET Lista todos os registros de Docs por matricula */
    async findAllMatric(
      req: Request<{}, {}, {}, { matricula: string }>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const { matricula } = req.query;
        if (!matricula) {
          return res.status(400).send({ success: false, message: 'matricula parameter is required' });
        }
        const docs = await this.docsRepository.findDocsAllMatric(matricula);
        return res.status(200).send({ success: true, docs });
      } catch (error) {
        next(error);
      }
    }
  
    /** GET Busca um registro de Email por matricula */
    async findByMatric(
      req: Request<{}, {}, {}, { matricula: string }>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const { matricula } = req.query;
        if (!matricula) {
          return res.status(400).send({ success: false, message: 'matricula parameter is required' });
        }
        const docs = await this.docsRepository.findDocsByMatric(matricula);
        return res.status(200).send({ success: true, docs });
      } catch (error) {
        next(error);
      }
    }
  
    /** GET Lista todos os registros de Email por cadastroId */
    async findByCadastrosId(
      req: Request<{ cadastrosId: string }>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const cadastrosId = Number(req.params.cadastrosId);
        const docs = await this.docsRepository.findDocsByCadastrosId(cadastrosId);
        return res.status(200).send({ success: true, docs });
      } catch (error) {
        next(error);
      }
    }
  }
  