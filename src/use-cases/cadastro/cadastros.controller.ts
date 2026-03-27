
//
// C:\repository\proj-full-stack-backend\src\use-cases\cadastro\cadastros.controller.ts
import { NextFunction, Request, Response } from 'express';
import { CadastrosRepository } from './cadastros.repository';
import { CadastrosCreate, CadastrosUpdate } from './cadastros.dto';
import { HttpException } from '../../exceptions/HttpException';

export class CadastrosController {
  constructor(private readonly cadastrosRepository: CadastrosRepository) {}

  // ============================================================
  // * CRUD *
  // ============================================================

  /** POST → Criar novo cadastro */
  async createNewCadastros(
    req: Request<{}, {}, CadastrosCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cadastros = await this.cadastrosRepository.createCadastros(req.body);

      return res.status(201).send({
        success: true,
        cadastros
      });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH → Atualizar cadastro pelo ID */
  async updateIdCadastros(
    req: Request<{ cadastrosId: string }, {}, CadastrosUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cadastrosId = Number(req.params.cadastrosId);

      if (Number.isNaN(cadastrosId) || cadastrosId <= 0) {
        throw new HttpException(400, 'ID do cadastro inválido');
      }

      const cadastros = await this.cadastrosRepository.updateCadastrosId(
        cadastrosId,
        req.body
      );

      return res.status(200).send({
        success: true,
        cadastros
      });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE → Remover cadastro */
  async removeIdCadastros(
    req: Request<{ cadastrosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cadastrosId = Number(req.params.cadastrosId);

      if (Number.isNaN(cadastrosId) || cadastrosId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      await this.cadastrosRepository.deleteCadastrosId(cadastrosId);

      return res.status(200).send({
        success: true,
        message: `Cadastro ID ${cadastrosId} removido com sucesso.`
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar cadastro pelo ID */
  async getOneCadastrosId(
    req: Request<{ cadastrosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cadastrosId = Number(req.params.cadastrosId);

      if (Number.isNaN(cadastrosId) || cadastrosId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const cadastros =
        await this.cadastrosRepository.findOneCadastrosById(cadastrosId);

      if (!cadastros) {
        throw new HttpException(
          404,
          `Cadastro ID ${cadastrosId} não encontrado.`
        );
      }

      return res.status(200).send({
        success: true,
        cadastros
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista todos os cadastros */
  async findAllCadastros(req: Request, res: Response, next: NextFunction) {
    try {
      const cadastros = await this.cadastrosRepository.findCadastrosAll(
        undefined,
        { id: 'ASC' }
      );

      return res.status(200).send({
        success: true,
        cadastros
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================

  /** GET → Pesquisa combinada */
  async searchCadastrosAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        id,
        endereco,
        complemento,
        bairro,
        cep,
        id_empresas,
        id_visitantes,
        id_consumidores,
        id_clientes,
        id_fornecedores,
        id_funcionarios,
        id_cidades,
        id_imagens,
        has_email,
        has_doc,
        has_fone
      } = req.query;

      const cadastros = await this.cadastrosRepository.searchCadastros({
        id: id !== undefined ? Number(id) : undefined,
        endereco: endereco !== undefined ? String(endereco) : undefined,
        complemento:
          complemento !== undefined ? String(complemento) : undefined,
        bairro: bairro !== undefined ? String(bairro) : undefined,
        cep: cep !== undefined ? String(cep) : undefined,
        id_empresas: id_empresas !== undefined ? Number(id_empresas) : undefined,
        id_visitantes:
          id_visitantes !== undefined ? Number(id_visitantes) : undefined,
        id_consumidores:
          id_consumidores !== undefined ? Number(id_consumidores) : undefined,
        id_clientes: id_clientes !== undefined ? Number(id_clientes) : undefined,
        id_fornecedores:
          id_fornecedores !== undefined ? Number(id_fornecedores) : undefined,
        id_funcionarios:
          id_funcionarios !== undefined ? Number(id_funcionarios) : undefined,
        id_cidades: id_cidades !== undefined ? Number(id_cidades) : undefined,
        id_imagens: id_imagens !== undefined ? Number(id_imagens) : undefined,
        has_email: has_email !== undefined ? Number(has_email) : undefined,
        has_doc: has_doc !== undefined ? Number(has_doc) : undefined,
        has_fone: has_fone !== undefined ? Number(has_fone) : undefined
      });

      return res.status(200).send({
        success: true,
        cadastros
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por endereço aproximado */
  async searchCadastrosEndereco(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text =
        req.query.text !== undefined ? String(req.query.text) : undefined;

      const cadastros =
        await this.cadastrosRepository.searchEnderecoParcialCadastros(text);

      return res.status(200).send({
        success: true,
        cadastros
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por bairro aproximado */
  async searchCadastrosBairro(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text =
        req.query.text !== undefined ? String(req.query.text) : undefined;

      const cadastros =
        await this.cadastrosRepository.searchBairroParcialCadastros(text);

      return res.status(200).send({
        success: true,
        cadastros
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por CEP aproximado */
  async searchCadastrosCep(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text =
        req.query.text !== undefined ? String(req.query.text) : undefined;

      const cadastros =
        await this.cadastrosRepository.searchCepParcialCadastros(text);

      return res.status(200).send({
        success: true,
        cadastros
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar cadastros por empresa */
  async findAllCadastrosEmpresasId(
    req: Request<{ empresasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const empresasId = Number(req.params.empresasId);

      if (Number.isNaN(empresasId) || empresasId <= 0) {
        throw new HttpException(400, 'ID da empresa inválido');
      }

      const cadastros =
        await this.cadastrosRepository.findAllCadastrosByEmpresasId(empresasId);

      return res.status(200).send({
        success: true,
        total: cadastros.length,
        cadastros
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar cadastros por visitante */
  async findAllCadastrosVisitantesId(
    req: Request<{ visitantesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const visitantesId = Number(req.params.visitantesId);

      if (Number.isNaN(visitantesId) || visitantesId <= 0) {
        throw new HttpException(400, 'ID do visitante inválido');
      }

      const cadastros =
        await this.cadastrosRepository.findAllCadastrosByVisitantesId(
          visitantesId
        );

      return res.status(200).send({
        success: true,
        total: cadastros.length,
        cadastros
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar cadastros por consumidor */
  async findAllCadastrosConsumidoresId(
    req: Request<{ consumidoresId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const consumidoresId = Number(req.params.consumidoresId);

      if (Number.isNaN(consumidoresId) || consumidoresId <= 0) {
        throw new HttpException(400, 'ID do consumidor inválido');
      }

      const cadastros =
        await this.cadastrosRepository.findAllCadastrosByConsumidoresId(
          consumidoresId
        );

      return res.status(200).send({
        success: true,
        total: cadastros.length,
        cadastros
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar cadastros por cliente */
  async findAllCadastrosClientesId(
    req: Request<{ clientesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const clientesId = Number(req.params.clientesId);

      if (Number.isNaN(clientesId) || clientesId <= 0) {
        throw new HttpException(400, 'ID do cliente inválido');
      }

      const cadastros =
        await this.cadastrosRepository.findAllCadastrosByClientesId(clientesId);

      return res.status(200).send({
        success: true,
        total: cadastros.length,
        cadastros
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar cadastros por fornecedor */
  async findAllCadastrosFornecedoresId(
    req: Request<{ fornecedoresId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const fornecedoresId = Number(req.params.fornecedoresId);

      if (Number.isNaN(fornecedoresId) || fornecedoresId <= 0) {
        throw new HttpException(400, 'ID do fornecedor inválido');
      }

      const cadastros =
        await this.cadastrosRepository.findAllCadastrosByFornecedoresId(
          fornecedoresId
        );

      return res.status(200).send({
        success: true,
        total: cadastros.length,
        cadastros
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar cadastros por funcionário */
  async findAllCadastrosFuncionariosId(
    req: Request<{ funcionariosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const funcionariosId = Number(req.params.funcionariosId);

      if (Number.isNaN(funcionariosId) || funcionariosId <= 0) {
        throw new HttpException(400, 'ID do funcionário inválido');
      }

      const cadastros =
        await this.cadastrosRepository.findAllCadastrosByFuncionariosId(
          funcionariosId
        );

      return res.status(200).send({
        success: true,
        total: cadastros.length,
        cadastros
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista cadastros com detalhes */
  async listAllCadastrosDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cadastros = await this.cadastrosRepository.listAllCadastrosDetails();

      return res.status(200).send({
        success: true,
        cadastros
      });
    } catch (error) {
      next(error);
    }
  }
}