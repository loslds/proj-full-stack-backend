
// C:\repository\proj-full-stack-backend\src\use-cases\cidade\cidades.controller.ts
import { Request, Response, NextFunction } from "express";
import { CidadesRepository } from "./cidades.repository";
import { CidadesCreate, CidadesUpdate } from "./cidades.dto";
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

    if (!cidadesId || isNaN(cidadesId) || cidadesId <= 0) {
      return res.status(400).send({ success: false, message: "Invalid cidadesId" });
    }

    try {
      const cidades = await this.cidadesRepository.updateCidades(cidadesId, req.body);
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

    if (!cidadesId || isNaN(cidadesId) || cidadesId <= 0) {
      return res.status(400).send({ success: false, message: "Invalid cidadesId" });
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
      const cidades = await this.cidadesRepository.findCidadesAll({}, { nome: "ASC" });
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

    if (!cidadesId || isNaN(cidadesId) || cidadesId <= 0) {
      return res.status(400).send({ success: false, message: "Invalid cidadesId" });
    }

    try {
      const cidades = await this.cidadesRepository.findOneCidadesById(cidadesId);
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
        message: "nome parameter is required",
      });
    }

    try {
      const cidades = await this.cidadesRepository.findOneCidadesByNome(String(nome));
      return res.status(200).send({ success: true, cidades });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================
  // 7 - GET → Busca por UF
  // ==========================================================
  async findOneCidadesByUf(
    req: Request<{}, {}, {}, { uf?: string }>,
    res: Response,
    next: NextFunction
  ) {
    const { uf } = req.query;

    if (!uf) {
      return res.status(400).send({
        success: false,
        message: "UF parameter is required",
      });
    }

    try {
      const cidades = await this.cidadesRepository.findOneCidadesByUf(String(uf));
      return res.status(200).send({ success: true, cidades });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================
  // 8 - GET → Pesquisa por nome OU estado (paginado)
  // ==========================================================
  async searchByNomeOuEstadoPaginado(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const term = req.query.nome ? String(req.query.nome) : undefined;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;

      const { data, total } =
        await this.cidadesRepository.searchCidadesByNomeOuEstadoPaginado(
          term,
          page,
          limit
        );

      return res.json({
        success: true,
        total,
        page,
        perPage: limit,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================
  // 9 - GET → Lista cidades + estado (detalhes)
  // ==========================================================
  async listAllCidadesDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.cidadesRepository.listAllCidadesDetails();
      return res.status(200).send({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================
  // 10 - GET → Lista estados em cidades == cidades.id_estados
  // ==========================================================
  /** 10 - GET → Lista todas as cidades de um estado por ID */
  async listAllCidadesByIdEstado(
    req: Request<{ id_estados: string }>,
    res: Response,
    next: NextFunction
  ) {
    const id_estados = Number(req.params.id_estados);

    if (!id_estados || isNaN(id_estados) || id_estados <= 0) {
      return res
        .status(400)
        .send({ success: false, message: "id_estados inválido" });
    }

    try {
      const cidades = await this.cidadesRepository.FindAllCidadesByIdEstado(id_estados);

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