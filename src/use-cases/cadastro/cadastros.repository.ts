
// C:\repository\proj-full-stack-backend\src\use-cases\cadastro\cadastros.repository.ts

import {
  DataSource,
  DeepPartial,
  FindOptionsWhere,
  FindOptionsOrder,
  Repository
} from 'typeorm';

import { CadastrosEntity } from './cadastros.entity';
import type { CadastrosCreate } from './cadastros.dto';

export class CadastrosRepository {
  private repo: Repository<CadastrosEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(CadastrosEntity);
  }

  // ============================================================
  // * DUPLICIDADE *
  // ============================================================
  async hasDuplicatedOrigem(
    params: {
      id_empresas?: number;
      id_visitantes?: number;
      id_consumidores?: number;
      id_clientes?: number;
      id_fornecedores?: number;
      id_funcionarios?: number;
    },
    excludes: number[] = []
  ): Promise<CadastrosEntity | null> {
    const query = this.repo.createQueryBuilder('cadastros');

    if (typeof params.id_empresas === 'number' && params.id_empresas > 0) {
      query.andWhere('cadastros.id_empresas = :id_empresas', {
        id_empresas: params.id_empresas
      });
    }

    if (typeof params.id_visitantes === 'number' && params.id_visitantes > 0) {
      query.andWhere('cadastros.id_visitantes = :id_visitantes', {
        id_visitantes: params.id_visitantes
      });
    }

    if (
      typeof params.id_consumidores === 'number' &&
      params.id_consumidores > 0
    ) {
      query.andWhere('cadastros.id_consumidores = :id_consumidores', {
        id_consumidores: params.id_consumidores
      });
    }

    if (typeof params.id_clientes === 'number' && params.id_clientes > 0) {
      query.andWhere('cadastros.id_clientes = :id_clientes', {
        id_clientes: params.id_clientes
      });
    }

    if (
      typeof params.id_fornecedores === 'number' &&
      params.id_fornecedores > 0
    ) {
      query.andWhere('cadastros.id_fornecedores = :id_fornecedores', {
        id_fornecedores: params.id_fornecedores
      });
    }

    if (
      typeof params.id_funcionarios === 'number' &&
      params.id_funcionarios > 0
    ) {
      query.andWhere('cadastros.id_funcionarios = :id_funcionarios', {
        id_funcionarios: params.id_funcionarios
      });
    }

    if (excludes.length > 0) {
      query.andWhere('cadastros.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }

  // ============================================================
  // * CRUD *
  // ============================================================
  async findCadastrosAll(
    where?:
      | FindOptionsWhere<CadastrosEntity>
      | FindOptionsWhere<CadastrosEntity>[],
    orderBy: FindOptionsOrder<CadastrosEntity> = { id: 'ASC' }
  ): Promise<CadastrosEntity[]> {
    return this.repo.find({
      where,
      relations: {
        empresas: true,
        visitantes: true,
        consumidores: true,
        clientes: true,
        fornecedores: true,
        funcionarios: true,
        cidades: {
          estados: true
        },
        imagens: true
      },
      order: orderBy
    });
  }

  async createCadastros(
    cadastros: CadastrosCreate
  ): Promise<CadastrosEntity> {
    this.validateOrigemUnica(cadastros);

    const duplicated = await this.hasDuplicatedOrigem({
      id_empresas: cadastros.id_empresas,
      id_visitantes: cadastros.id_visitantes,
      id_consumidores: cadastros.id_consumidores,
      id_clientes: cadastros.id_clientes,
      id_fornecedores: cadastros.id_fornecedores,
      id_funcionarios: cadastros.id_funcionarios
    });

    if (duplicated) {
      throw new Error(
        'Cadastro duplicado! Já existe cadastro para a origem informada.'
      );
    }

    const data = this.repo.create({
      ...cadastros,
      id_empresas: cadastros.id_empresas ?? 0,
      id_visitantes: cadastros.id_visitantes ?? 0,
      id_consumidores: cadastros.id_consumidores ?? 0,
      id_clientes: cadastros.id_clientes ?? 0,
      id_fornecedores: cadastros.id_fornecedores ?? 0,
      id_funcionarios: cadastros.id_funcionarios ?? 0,
      id_cidades: cadastros.id_cidades ?? 0,
      id_imagens: cadastros.id_imagens ?? 0,
      has_email: cadastros.has_email ?? 0,
      has_doc: cadastros.has_doc ?? 0,
      has_fone: cadastros.has_fone ?? 0,
      createdBy: cadastros.createdBy ?? 0,
      updatedBy: cadastros.updatedBy ?? 0
    });

    return this.repo.save(data);
  }

  async findOneCadastrosById(
    cadastrosId: number
  ): Promise<CadastrosEntity | null> {
    this.validateId(cadastrosId);

    return this.repo.findOne({
      where: { id: cadastrosId },
      relations: {
        empresas: true,
        visitantes: true,
        consumidores: true,
        clientes: true,
        fornecedores: true,
        funcionarios: true,
        cidades: {
          estados: true
        },
        imagens: true
      }
    });
  }

  async updateCadastrosId(
    cadastrosId: number,
    cadastros: DeepPartial<CadastrosEntity>
  ): Promise<CadastrosEntity> {
    this.validateId(cadastrosId);

    const current = await this.repo.findOne({
      where: { id: cadastrosId }
    });

    if (!current) {
      throw new Error(`Cadastro com ID ${cadastrosId} não encontrado.`);
    }

    this.validateOrigemUnica({
      id_empresas: cadastros.id_empresas ?? current.id_empresas,
      id_visitantes: cadastros.id_visitantes ?? current.id_visitantes,
      id_consumidores: cadastros.id_consumidores ?? current.id_consumidores,
      id_clientes: cadastros.id_clientes ?? current.id_clientes,
      id_fornecedores: cadastros.id_fornecedores ?? current.id_fornecedores,
      id_funcionarios: cadastros.id_funcionarios ?? current.id_funcionarios
    });

    const duplicated = await this.hasDuplicatedOrigem(
      {
        id_empresas: cadastros.id_empresas ?? current.id_empresas,
        id_visitantes: cadastros.id_visitantes ?? current.id_visitantes,
        id_consumidores: cadastros.id_consumidores ?? current.id_consumidores,
        id_clientes: cadastros.id_clientes ?? current.id_clientes,
        id_fornecedores:
          cadastros.id_fornecedores ?? current.id_fornecedores,
        id_funcionarios:
          cadastros.id_funcionarios ?? current.id_funcionarios
      },
      [cadastrosId]
    );

    if (duplicated) {
      throw new Error(
        'Cadastro duplicado! Já existe cadastro para a origem informada.'
      );
    }

    const data = this.repo.create({
      ...current,
      ...cadastros,
      id: cadastrosId
    });

    return this.repo.save(data);
  }

  async deleteCadastrosId(cadastrosId: number): Promise<boolean> {
    this.validateId(cadastrosId);

    const result = await this.repo.delete(cadastrosId);

    if (result.affected === 0) {
      throw new Error(`Cadastro com ID ${cadastrosId} não encontrado.`);
    }

    return true;
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================
  async searchCadastros(params: {
    id?: number;
    endereco?: string;
    complemento?: string;
    bairro?: string;
    cep?: string;
    id_empresas?: number;
    id_visitantes?: number;
    id_consumidores?: number;
    id_clientes?: number;
    id_fornecedores?: number;
    id_funcionarios?: number;
    id_cidades?: number;
    id_imagens?: number;
    has_email?: number;
    has_doc?: number;
    has_fone?: number;
  }): Promise<CadastrosEntity[]> {
    const query = this.repo
      .createQueryBuilder('cadastros')
      .leftJoinAndSelect('cadastros.empresas', 'empresas')
      .leftJoinAndSelect('cadastros.visitantes', 'visitantes')
      .leftJoinAndSelect('cadastros.consumidores', 'consumidores')
      .leftJoinAndSelect('cadastros.clientes', 'clientes')
      .leftJoinAndSelect('cadastros.fornecedores', 'fornecedores')
      .leftJoinAndSelect('cadastros.funcionarios', 'funcionarios')
      .leftJoinAndSelect('cadastros.cidades', 'cidades')
      .leftJoinAndSelect('cidades.estados', 'estados')
      .leftJoinAndSelect('cadastros.imagens', 'imagens')
      .orderBy('cadastros.id', 'ASC');

    if (typeof params.id === 'number') {
      query.andWhere('cadastros.id = :id', { id: params.id });
    }

    if (params.endereco) {
      query.andWhere(
        'cadastros.endereco LIKE :endereco COLLATE utf8mb4_general_ci',
        { endereco: `%${params.endereco}%` }
      );
    }

    if (params.complemento) {
      query.andWhere(
        'cadastros.complemento LIKE :complemento COLLATE utf8mb4_general_ci',
        { complemento: `%${params.complemento}%` }
      );
    }

    if (params.bairro) {
      query.andWhere(
        'cadastros.bairro LIKE :bairro COLLATE utf8mb4_general_ci',
        { bairro: `%${params.bairro}%` }
      );
    }

    if (params.cep) {
      query.andWhere(
        'cadastros.cep LIKE :cep COLLATE utf8mb4_general_ci',
        { cep: `%${params.cep}%` }
      );
    }

    if (typeof params.id_empresas === 'number') {
      query.andWhere('cadastros.id_empresas = :id_empresas', {
        id_empresas: params.id_empresas
      });
    }

    if (typeof params.id_visitantes === 'number') {
      query.andWhere('cadastros.id_visitantes = :id_visitantes', {
        id_visitantes: params.id_visitantes
      });
    }

    if (typeof params.id_consumidores === 'number') {
      query.andWhere('cadastros.id_consumidores = :id_consumidores', {
        id_consumidores: params.id_consumidores
      });
    }

    if (typeof params.id_clientes === 'number') {
      query.andWhere('cadastros.id_clientes = :id_clientes', {
        id_clientes: params.id_clientes
      });
    }

    if (typeof params.id_fornecedores === 'number') {
      query.andWhere('cadastros.id_fornecedores = :id_fornecedores', {
        id_fornecedores: params.id_fornecedores
      });
    }

    if (typeof params.id_funcionarios === 'number') {
      query.andWhere('cadastros.id_funcionarios = :id_funcionarios', {
        id_funcionarios: params.id_funcionarios
      });
    }

    if (typeof params.id_cidades === 'number') {
      query.andWhere('cadastros.id_cidades = :id_cidades', {
        id_cidades: params.id_cidades
      });
    }

    if (typeof params.id_imagens === 'number') {
      query.andWhere('cadastros.id_imagens = :id_imagens', {
        id_imagens: params.id_imagens
      });
    }

    if (typeof params.has_email === 'number') {
      query.andWhere('cadastros.has_email = :has_email', {
        has_email: params.has_email
      });
    }

    if (typeof params.has_doc === 'number') {
      query.andWhere('cadastros.has_doc = :has_doc', {
        has_doc: params.has_doc
      });
    }

    if (typeof params.has_fone === 'number') {
      query.andWhere('cadastros.has_fone = :has_fone', {
        has_fone: params.has_fone
      });
    }

    return query.getMany();
  }

  async searchEnderecoParcialCadastros(
    text?: string
  ): Promise<CadastrosEntity[]> {
    const query = this.repo
      .createQueryBuilder('cadastros')
      .leftJoinAndSelect('cadastros.empresas', 'empresas')
      .leftJoinAndSelect('cadastros.visitantes', 'visitantes')
      .leftJoinAndSelect('cadastros.consumidores', 'consumidores')
      .leftJoinAndSelect('cadastros.clientes', 'clientes')
      .leftJoinAndSelect('cadastros.fornecedores', 'fornecedores')
      .leftJoinAndSelect('cadastros.funcionarios', 'funcionarios')
      .leftJoinAndSelect('cadastros.cidades', 'cidades')
      .leftJoinAndSelect('cidades.estados', 'estados')
      .leftJoinAndSelect('cadastros.imagens', 'imagens')
      .orderBy('cadastros.id', 'ASC');

    if (text && text.trim() !== '') {
      query.andWhere(
        'cadastros.endereco LIKE :text COLLATE utf8mb4_general_ci',
        { text: `%${text}%` }
      );
    }

    return query.getMany();
  }

  async searchBairroParcialCadastros(
    text?: string
  ): Promise<CadastrosEntity[]> {
    const query = this.repo
      .createQueryBuilder('cadastros')
      .leftJoinAndSelect('cadastros.empresas', 'empresas')
      .leftJoinAndSelect('cadastros.visitantes', 'visitantes')
      .leftJoinAndSelect('cadastros.consumidores', 'consumidores')
      .leftJoinAndSelect('cadastros.clientes', 'clientes')
      .leftJoinAndSelect('cadastros.fornecedores', 'fornecedores')
      .leftJoinAndSelect('cadastros.funcionarios', 'funcionarios')
      .leftJoinAndSelect('cadastros.cidades', 'cidades')
      .leftJoinAndSelect('cidades.estados', 'estados')
      .leftJoinAndSelect('cadastros.imagens', 'imagens')
      .orderBy('cadastros.id', 'ASC');

    if (text && text.trim() !== '') {
      query.andWhere(
        'cadastros.bairro LIKE :text COLLATE utf8mb4_general_ci',
        { text: `%${text}%` }
      );
    }

    return query.getMany();
  }

  async searchCepParcialCadastros(
    text?: string
  ): Promise<CadastrosEntity[]> {
    const query = this.repo
      .createQueryBuilder('cadastros')
      .leftJoinAndSelect('cadastros.empresas', 'empresas')
      .leftJoinAndSelect('cadastros.visitantes', 'visitantes')
      .leftJoinAndSelect('cadastros.consumidores', 'consumidores')
      .leftJoinAndSelect('cadastros.clientes', 'clientes')
      .leftJoinAndSelect('cadastros.fornecedores', 'fornecedores')
      .leftJoinAndSelect('cadastros.funcionarios', 'funcionarios')
      .leftJoinAndSelect('cadastros.cidades', 'cidades')
      .leftJoinAndSelect('cidades.estados', 'estados')
      .leftJoinAndSelect('cadastros.imagens', 'imagens')
      .orderBy('cadastros.id', 'ASC');

    if (text && text.trim() !== '') {
      query.andWhere(
        'cadastros.cep LIKE :text COLLATE utf8mb4_general_ci',
        { text: `%${text}%` }
      );
    }

    return query.getMany();
  }

  async findAllCadastrosByEmpresasId(
    empresasId: number
  ): Promise<CadastrosEntity[]> {
    return this.repo.find({
      where: { id_empresas: empresasId },
      relations: {
        empresas: true,
        cidades: {
          estados: true
        },
        imagens: true
      },
      order: { id: 'ASC' }
    });
  }

  async findAllCadastrosByVisitantesId(
    visitantesId: number
  ): Promise<CadastrosEntity[]> {
    return this.repo.find({
      where: { id_visitantes: visitantesId },
      relations: {
        visitantes: true,
        cidades: {
          estados: true
        },
        imagens: true
      },
      order: { id: 'ASC' }
    });
  }

  async findAllCadastrosByConsumidoresId(
    consumidoresId: number
  ): Promise<CadastrosEntity[]> {
    return this.repo.find({
      where: { id_consumidores: consumidoresId },
      relations: {
        consumidores: true,
        cidades: {
          estados: true
        },
        imagens: true
      },
      order: { id: 'ASC' }
    });
  }

  async findAllCadastrosByClientesId(
    clientesId: number
  ): Promise<CadastrosEntity[]> {
    return this.repo.find({
      where: { id_clientes: clientesId },
      relations: {
        clientes: true,
        cidades: {
          estados: true
        },
        imagens: true
      },
      order: { id: 'ASC' }
    });
  }

  async findAllCadastrosByFornecedoresId(
    fornecedoresId: number
  ): Promise<CadastrosEntity[]> {
    return this.repo.find({
      where: { id_fornecedores: fornecedoresId },
      relations: {
        fornecedores: true,
        cidades: {
          estados: true
        },
        imagens: true
      },
      order: { id: 'ASC' }
    });
  }

  async findAllCadastrosByFuncionariosId(
    funcionariosId: number
  ): Promise<CadastrosEntity[]> {
    return this.repo.find({
      where: { id_funcionarios: funcionariosId },
      relations: {
        funcionarios: true,
        cidades: {
          estados: true
        },
        imagens: true
      },
      order: { id: 'ASC' }
    });
  }

  async listAllCadastrosDetails(): Promise<CadastrosEntity[]> {
    return this.repo
      .createQueryBuilder('cadastros')
      .leftJoinAndSelect('cadastros.empresas', 'empresas')
      .leftJoinAndSelect('cadastros.visitantes', 'visitantes')
      .leftJoinAndSelect('cadastros.consumidores', 'consumidores')
      .leftJoinAndSelect('cadastros.clientes', 'clientes')
      .leftJoinAndSelect('cadastros.fornecedores', 'fornecedores')
      .leftJoinAndSelect('cadastros.funcionarios', 'funcionarios')
      .leftJoinAndSelect('cadastros.cidades', 'cidades')
      .leftJoinAndSelect('cidades.estados', 'estados')
      .leftJoinAndSelect('cadastros.imagens', 'imagens')
      .orderBy('cadastros.id', 'ASC')
      .getMany();
  }

  // ============================================================
  // * UTIL *
  // ============================================================
  private validateId(id: number): void {
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      throw new Error('Invalid cadastrosId');
    }
  }

  private validateOrigemUnica(params: {
    id_empresas?: number;
    id_visitantes?: number;
    id_consumidores?: number;
    id_clientes?: number;
    id_fornecedores?: number;
    id_funcionarios?: number;
  }): void {
    const ativos = [
      params.id_empresas ?? 0,
      params.id_visitantes ?? 0,
      params.id_consumidores ?? 0,
      params.id_clientes ?? 0,
      params.id_fornecedores ?? 0,
      params.id_funcionarios ?? 0
    ].filter((valor) => valor > 0).length;

    if (ativos !== 1) {
      throw new Error(
        'Cadastro inválido! Deve existir exatamente um id de origem ativo.'
      );
    }
  }
}

