// C:\repository\proj-full-stack-backend\src\use-cases\arquivado\arquivados.repository.ts
import {
  DataSource,
  DeepPartial,
  FindOptionsWhere,
  FindOptionsOrder,
  Repository
} from 'typeorm';

import { ArquivadosEntity } from './arquivados.entity';
import type { ArquivadosCreate } from './arquivados.dto';

export class ArquivadosRepository {
  private repo: Repository<ArquivadosEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(ArquivadosEntity);
  }

  // ============================================================
  // * CRUD *
  // ============================================================
  async findArquivadosAll(
    where?:
      | FindOptionsWhere<ArquivadosEntity>
      | FindOptionsWhere<ArquivadosEntity>[],
    orderBy: FindOptionsOrder<ArquivadosEntity> = { id: 'ASC' }
  ): Promise<ArquivadosEntity[]> {
    return this.repo.find({
      where,
      order: orderBy
    });
  }

  async createArquivados(
    arquivados: ArquivadosCreate
  ): Promise<ArquivadosEntity> {
    // Um mesmo registro pode ser arquivado, desarquivado e arquivado de
    // novo: por isso não há bloqueio de duplicidade (cada linha é um evento).
    const data = this.repo.create({
      ...arquivados,
      createdBy: arquivados.createdBy ?? 0,
      updatedBy: arquivados.updatedBy ?? 0
    });

    return this.repo.save(data);
  }

  async findOneArquivadosById(
    arquivadosId: number
  ): Promise<ArquivadosEntity | null> {
    this.validateId(arquivadosId);

    return this.repo.findOne({
      where: { id: arquivadosId }
    });
  }

  async updateArquivadosId(
    arquivadosId: number,
    arquivados: DeepPartial<ArquivadosEntity>
  ): Promise<ArquivadosEntity> {
    this.validateId(arquivadosId);

    const current = await this.repo.findOne({
      where: { id: arquivadosId }
    });

    if (!current) {
      throw new Error(`Arquivado com ID ${arquivadosId} não encontrado.`);
    }

    const data = this.repo.create({
      ...current,
      ...arquivados,
      id: arquivadosId
    });

    return this.repo.save(data);
  }

  async deleteArquivadosId(arquivadosId: number): Promise<boolean> {
    this.validateId(arquivadosId);

    const result = await this.repo.delete(arquivadosId);

    if (result.affected === 0) {
      throw new Error(`Arquivado com ID ${arquivadosId} não encontrado.`);
    }

    return true;
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================

  /** Histórico de um registro (todas as vezes que foi arquivado). */
  async findAllArquivadosByOrigem(
    tab_origem: string,
    id_origem: number
  ): Promise<ArquivadosEntity[]> {
    return this.repo.find({
      where: { tab_origem, id_origem },
      order: { id: 'ASC' }
    });
  }

  async searchArquivados(params: {
    id?: number;
    tab_origem?: string;
    id_origem?: number;
    tab_destino?: string;
    id_destino?: number;
    id_users?: number;
    nomeusers?: string;
  }): Promise<ArquivadosEntity[]> {
    const query = this.repo
      .createQueryBuilder('arquivados')
      .orderBy('arquivados.id', 'ASC');

    if (typeof params.id === 'number') {
      query.andWhere('arquivados.id = :id', { id: params.id });
    }

    if (params.tab_origem) {
      query.andWhere('arquivados.tab_origem = :tab_origem', {
        tab_origem: params.tab_origem
      });
    }

    if (typeof params.id_origem === 'number') {
      query.andWhere('arquivados.id_origem = :id_origem', {
        id_origem: params.id_origem
      });
    }

    if (params.tab_destino) {
      query.andWhere('arquivados.tab_destino = :tab_destino', {
        tab_destino: params.tab_destino
      });
    }

    if (typeof params.id_destino === 'number') {
      query.andWhere('arquivados.id_destino = :id_destino', {
        id_destino: params.id_destino
      });
    }

    if (typeof params.id_users === 'number') {
      query.andWhere('arquivados.id_users = :id_users', {
        id_users: params.id_users
      });
    }

    if (params.nomeusers) {
      query.andWhere(
        'arquivados.nomeusers LIKE :nomeusers COLLATE utf8mb4_general_ci',
        { nomeusers: `%${params.nomeusers}%` }
      );
    }

    return query.getMany();
  }

  // ============================================================
  // * UTIL *
  // ============================================================
  private validateId(id: number): void {
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      throw new Error('Invalid arquivadosId');
    }
  }
}
