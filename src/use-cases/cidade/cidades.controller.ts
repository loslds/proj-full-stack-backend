
  
// C:\repository\proj-full-stack-backend\src\use-cases\cidade\cidades.controller.ts
import { Request, Response, NextFunction } from 'express';
import { CidadesRepository } from './cidades.repository';
import { CidadesCreate, CidadesUpdate } from './cidades.dto';

export class CidadesController {
  constructor(private readonly cidadesRepository: CidadesRepository) {}

  // ==========================================================
  // 1 - POST → Cria Cidade
  // ==========================================================
  async createNewCidades(
    req: Request<{}, {}, CidadesCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cidades = await this.cidadesRepository.createCidades(req.body);
      return res.status(201).send({ success: true, cidades });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================
  // 2 - PATCH → Atualiza Cidade
  // ==========================================================
  async updateIdCidades(
    req: Request<{ cidadesId: string }, {}, Partial<CidadesUpdate>>,
    res: Response,
    next: NextFunction
  ) {
    const cidadesId = Number(req.params.cidadesId);

    if (!cidadesId || Number.isNaN(cidadesId) || cidadesId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'cidadesId inválido' });
    }

    try {
      const cidades = await this.cidadesRepository.updateCidades(
        cidadesId,
        req.body
      );

      return res.status(200).send({ success: true, cidades });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================
  // 3 - DELETE → Remove (com trava de integridade)
  // ==========================================================
  async removeCidadesId(
    req: Request<{ cidadesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const cidadesId = Number(req.params.cidadesId);

    if (!cidadesId || Number.isNaN(cidadesId) || cidadesId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'cidadesId inválido' });
    }

    try {
      const success = await this.cidadesRepository.deleteCidadesId(cidadesId);
      return res.status(200).send({ success });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================
  // 4 - GET → Lista todas
  // ==========================================================
  async findAllCidades(req: Request, res: Response, next: NextFunction) {
    try {
      const cidades = await this.cidadesRepository.findCidadesAll(
        {},
        { nome: 'ASC' }
      );

      return res.status(200).send({ success: true, cidades });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================
  // 5 - GET → Busca por ID
  // ==========================================================
  async getOneIdCidades(
    req: Request<{ cidadesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const cidadesId = Number(req.params.cidadesId);

    if (!cidadesId || Number.isNaN(cidadesId) || cidadesId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'cidadesId inválido' });
    }

    try {
      const cidades = await this.cidadesRepository.findOneCidadesById(cidadesId);

      if (!cidades) {
        return res
          .status(404)
          .send({ success: false, message: 'Cidade não encontrada' });
      }

      return res.status(200).send({ success: true, cidades });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================
  // 6 - GET → Busca por Nome
  // ==========================================================
  async findOneNomeCidades(
    req: Request<{}, {}, {}, { nome?: string }>,
    res: Response,
    next: NextFunction
  ) {
    const { nome } = req.query;

    if (!nome) {
      return res.status(400).send({
        success: false,
        message: 'Parâmetro nome é obrigatório'
      });
    }

    try {
      const cidades = await this.cidadesRepository.findOneCidadesByNome(
        String(nome)
      );

      if (!cidades) {
        return res
          .status(404)
          .send({ success: false, message: 'Cidade não encontrada' });
      }

      return res.status(200).send({ success: true, cidades });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================
  // 7 - GET → Pesquisa por nome OU estado (paginado)
  // ==========================================================
  async searchByNomeOuEstadoPaginado(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const term = req.query.nome ? String(req.query.nome) : undefined;
      const page = req.query.page ? parseInt(String(req.query.page), 10) : 1;
      const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 100;

      const result =
        await this.cidadesRepository.searchCidadesByNomeOuEstadoPaginado(
          term,
          page,
          limit
        );

      return res.status(200).json({
        success: true,
        total: result.total,
        page: result.page,
        perPage: result.limit,
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================
  // 8 - GET → Lista cidades + estado (detalhes)
  // ==========================================================
  async listAllCidadesDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await this.cidadesRepository.listAllCidadesDetails();
      return res.status(200).send({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================
  // 9 - GET → Lista todas as cidades por id_estados
  // ==========================================================
  async listAllCidadesByIdEstado(
    req: Request<{ id_estados: string }>,
    res: Response,
    next: NextFunction
  ) {
    const id_estados = Number(req.params.id_estados);

    if (!id_estados || Number.isNaN(id_estados) || id_estados <= 0) {
      return res.status(400).send({
        success: false,
        message: 'id_estados inválido'
      });
    }

    try {
      const cidades =
        await this.cidadesRepository.findAllCidadesByIdEstado(id_estados);

      return res.status(200).send({
        success: true,
        total: cidades.length,
        cidades
      });
    } catch (error) {
      next(error);
    }
  }
}

