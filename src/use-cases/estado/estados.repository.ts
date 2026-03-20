
  
// C:\repository\proj-full-stack-backend\src\use-cases\estado\estados.repository.ts
import {
  DataSource,
  DeepPartial,
  Repository,
  FindOptionsWhere,
  FindOptionsOrder
} from 'typeorm';

import { EstadosEntity } from './estados.entity';
import type { EstadosCreate } from './estados.dto';

export class EstadosRepository {
  private repo: Repository<EstadosEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(EstadosEntity);
  }

  // ============================================================
  // * DUPLICIDADE *
  // ============================================================

  async hasDuplicated(
    nome?: string,
    prefixo?: string,
    excludeId?: number
  ): Promise<boolean> {
    const query = this.repo
      .createQueryBuilder('estados')
      .select(['estados.id']);

    if (nome) {
      query.andWhere('estados.nome = :nome', { nome });
    }

    if (prefixo) {
      query.andWhere('estados.prefixo = :prefixo', { prefixo });
    }

    if (excludeId) {
      query.andWhere('estados.id != :excludeId', { excludeId });
    }

    const result = await query.getOne();
    return !!result;
  }

  // ============================================================
  // * CRUD *
  // ============================================================

  async findEstadosAll(
    where?: FindOptionsWhere<EstadosEntity>,
    order?: FindOptionsOrder<EstadosEntity>
  ): Promise<EstadosEntity[]> {
    return this.repo.find({ where, order });
  }

  async createEstados(estados: EstadosCreate): Promise<EstadosEntity> {
    const exists = await this.hasDuplicated(estados.nome, estados.prefixo);

    if (exists) {
      throw new Error(
        `Estado duplicado! Já existe registro com nome "${estados.nome}" e prefixo "${estados.prefixo}".`
      );
    }

    const entity = this.repo.create({
      ...estados,
      createdBy: estados.createdBy ?? 0,
      updatedBy: estados.updatedBy ?? 0
    });

    return this.repo.save(entity);
  }

  async findEstadosById(estadosId: number): Promise<EstadosEntity | null> {
    this.validateId(estadosId);

    return this.repo.findOne({
      where: { id: estadosId }
    });
  }

  async updateEstados(
    estadosId: number,
    estados: DeepPartial<EstadosEntity>
  ): Promise<EstadosEntity> {
    this.validateId(estadosId);

    const current = await this.repo.findOne({
      where: { id: estadosId }
    });

    if (!current) {
      throw new Error(`Estado com id ${estadosId} não encontrado`);
    }

    const nome = estados.nome ?? current.nome;
    const prefixo = estados.prefixo ?? current.prefixo;

    const exists = await this.hasDuplicated(nome, prefixo, estadosId);

    if (exists) {
      throw new Error(
        `Estado duplicado! Já existe registro com nome "${nome}" e prefixo "${prefixo}".`
      );
    }

    const entity = await this.repo.preload({
      id: estadosId,
      ...estados
    });

    if (!entity) {
      throw new Error(`Estado com id ${estadosId} não encontrado`);
    }

    return this.repo.save(entity);
  }

  async deleteEstados(estadosId: number): Promise<void> {
    this.validateId(estadosId);

    const found = await this.repo.findOne({
      where: { id: estadosId }
    });

    if (!found) {
      throw new Error(`Estado com id ${estadosId} não encontrado`);
    }

    await this.repo.remove(found);
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================

  async searchEstados(params: {
    id?: number;
    nome?: string;
    prefixo?: string;
  }): Promise<EstadosEntity[]> {
    const query = this.repo
      .createQueryBuilder('estados')
      .select(['estados.id', 'estados.nome', 'estados.prefixo'])
      .orderBy('estados.id', 'ASC');

    if (params.id) {
      query.andWhere('estados.id = :id', { id: params.id });
    }

    if (params.nome) {
      query.andWhere('estados.nome LIKE :nome COLLATE utf8mb4_general_ci', {
        nome: `%${params.nome}%`
      });
    }

    if (params.prefixo) {
      query.andWhere(
        'estados.prefixo LIKE :prefixo COLLATE utf8mb4_general_ci',
        { prefixo: `%${params.prefixo}%` }
      );
    }

    return query.getMany();
  }

  async searchNomeEstados(text?: string): Promise<EstadosEntity[]> {
    const query = this.repo
      .createQueryBuilder('estados')
      .select(['estados.id', 'estados.nome', 'estados.prefixo'])
      .orderBy('estados.id', 'ASC')
      .limit(100);

    if (text) {
      query.andWhere('estados.nome LIKE :text COLLATE utf8mb4_general_ci', {
        text: `%${text}%`
      });
    }

    return query.getMany();
  }

  async searchPrefixoEstados(text?: string): Promise<EstadosEntity[]> {
    const query = this.repo
      .createQueryBuilder('estados')
      .select(['estados.id', 'estados.nome', 'estados.prefixo'])
      .orderBy('estados.id', 'ASC')
      .limit(100);

    if (text) {
      query.andWhere(
        'estados.prefixo LIKE :text COLLATE utf8mb4_general_ci',
        { text: `%${text}%` }
      );
    }

    return query.getMany();
  }

  async findOneNomeEstados(nome: string): Promise<EstadosEntity | null> {
    return this.repo.findOne({ where: { nome } });
  }

  async findAllNomeEstados(nome: string): Promise<EstadosEntity[]> {
    return this.repo.find({
      where: { nome },
      order: { id: 'ASC' },
      take: 100
    });
  }

  async findOnePrefixoEstados(prefixo: string): Promise<EstadosEntity | null> {
    return this.repo.findOne({ where: { prefixo } });
  }

  async findAllPrefixoEstados(prefixo: string): Promise<EstadosEntity[]> {
    return this.repo.find({
      where: { prefixo },
      order: { id: 'ASC' },
      take: 100
    });
  }

  // ============================================================
  // * UTIL *
  // ============================================================

  private validateId(id: number): void {
    if (!id || isNaN(id) || id <= 0) {
      throw new Error('Invalid estadosId');
    }
  }
}

