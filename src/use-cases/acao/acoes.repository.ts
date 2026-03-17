
//C:\repository\proj-full-stack-backend\src\use-cases\acao\acoes.repository.ts

import {
  DataSource,
  DeepPartial,
  Repository,
  FindOptionsWhere,
  FindOptionsOrder
} from 'typeorm';

import { AcoesEntity } from './acoes.entity';
import type { AcoesCreate } from './acoes.dto';

export class AcoesRepository {
  private repo: Repository<AcoesEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(AcoesEntity);
  }

  // ============================================================
  // * DUPLICIDADE *
  // ============================================================
  async hasDuplicated(
    nome?: string,
    abrev?: string,
    nivel?: number,
    excludeId?: number
  ): Promise<boolean> {
    const query = this.repo
      .createQueryBuilder('acoes')
      .select(['acoes.id']);

    if (nome) {
      query.orWhere('acoes.nome = :nome', { nome });
    }

    if (abrev) {
      query.orWhere('acoes.abrev = :abrev', { abrev });
    }

    if (typeof nivel === 'number') {
      query.orWhere('acoes.nivel = :nivel', { nivel });
    }

    if (excludeId) {
      query.andWhere('acoes.id != :excludeId', { excludeId });
    }

    const result = await query.getOne();
    return !!result;
  }

  // ============================================================
  // * CRUD *
  // ============================================================
  async findAcoesAll(
    where?: FindOptionsWhere<AcoesEntity>,
    order?: FindOptionsOrder<AcoesEntity>
  ): Promise<AcoesEntity[]> {
    return this.repo.find({ where, order });
  }

  async createAcoes(acoes: AcoesCreate): Promise<AcoesEntity> {
    const exists = await this.hasDuplicated(
      acoes.nome,
      acoes.abrev,
      acoes.nivel
    );

    if (exists) {
      throw new Error(
        'Ação duplicada! Já existe registro com nome, abrev ou nível informado.'
      );
    }

    const entity = this.repo.create({
      ...acoes,
      createdBy: acoes.createdBy ?? 0,
      updatedBy: acoes.updatedBy ?? 0
    });

    return this.repo.save(entity);
  }

  async findAcoesById(acoesId: number): Promise<AcoesEntity | null> {
    this.validateId(acoesId);

    return this.repo.findOne({
      where: { id: acoesId }
    });
  }

  async updateAcoes(
    acoesId: number,
    acoes: DeepPartial<AcoesEntity>
  ): Promise<AcoesEntity> {
    this.validateId(acoesId);

    const current = await this.repo.findOne({
      where: { id: acoesId }
    });

    if (!current) {
      throw new Error(`Ação com id ${acoesId} não encontrada`);
    }

    const nome = acoes.nome ?? current.nome;
    const abrev = acoes.abrev ?? current.abrev;
    const nivel = acoes.nivel ?? current.nivel;

    const exists = await this.hasDuplicated(
      nome,
      abrev,
      nivel,
      acoesId
    );

    if (exists) {
      throw new Error(
        'Ação duplicada! Já existe registro com nome, abrev ou nível informado.'
      );
    }

    const entity = await this.repo.preload({
      id: acoesId,
      ...acoes
    });

    if (!entity) {
      throw new Error(`Ação com id ${acoesId} não encontrada`);
    }

    return this.repo.save(entity);
  }

  async deleteAcoes(acoesId: number): Promise<void> {
    this.validateId(acoesId);

    const found = await this.repo.findOne({
      where: { id: acoesId }
    });

    if (!found) {
      throw new Error(`Ação com id ${acoesId} não encontrada`);
    }

    await this.repo.remove(found);
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================
  async searchAcoes(params: {
    id?: number;
    nome?: string;
    abrev?: string;
    nivel?: number;
  }): Promise<AcoesEntity[]> {
    const query = this.repo
      .createQueryBuilder('acoes')
      .select([
        'acoes.id',
        'acoes.nome',
        'acoes.abrev',
        'acoes.cor',
        'acoes.nivel'
      ])
      .orderBy('acoes.id', 'ASC');

    if (params.id) {
      query.andWhere('acoes.id = :id', { id: params.id });
    }

    if (params.nome) {
      query.andWhere(
        'acoes.nome LIKE :nome COLLATE utf8mb4_general_ci',
        { nome: `%${params.nome}%` }
      );
    }

    if (params.abrev) {
      query.andWhere(
        'acoes.abrev LIKE :abrev COLLATE utf8mb4_general_ci',
        { abrev: `%${params.abrev}%` }
      );
    }

    if (typeof params.nivel === 'number') {
      query.andWhere('acoes.nivel = :nivel', { nivel: params.nivel });
    }

    return query.getMany();
  }

  async searchNomeAcoes(text?: string): Promise<AcoesEntity[]> {
    const query = this.repo
      .createQueryBuilder('acoes')
      .select([
        'acoes.id',
        'acoes.nome',
        'acoes.abrev',
        'acoes.cor',
        'acoes.nivel'
      ])
      .orderBy('acoes.id', 'ASC')
      .limit(100);

    if (text) {
      query.andWhere(
        'acoes.nome LIKE :text COLLATE utf8mb4_general_ci',
        { text: `%${text}%` }
      );
    }

    return query.getMany();
  }

  async searchAbrevAcoes(text?: string): Promise<AcoesEntity[]> {
    const query = this.repo
      .createQueryBuilder('acoes')
      .select([
        'acoes.id',
        'acoes.nome',
        'acoes.abrev',
        'acoes.cor',
        'acoes.nivel'
      ])
      .orderBy('acoes.id', 'ASC')
      .limit(100);

    if (text) {
      query.andWhere(
        'acoes.abrev LIKE :text COLLATE utf8mb4_general_ci',
        { text: `%${text}%` }
      );
    }

    return query.getMany();
  }

  async findOneNomeAcoes(nome: string): Promise<AcoesEntity | null> {
    return this.repo.findOne({
      where: { nome }
    });
  }

  async findAllNomeAcoes(nome: string): Promise<AcoesEntity[]> {
    return this.repo.find({
      where: { nome },
      order: { id: 'ASC' },
      take: 100
    });
  }

  async findOneAbrevAcoes(abrev: string): Promise<AcoesEntity | null> {
    return this.repo.findOne({
      where: { abrev }
    });
  }

  async findAllAbrevAcoes(abrev: string): Promise<AcoesEntity[]> {
    return this.repo.find({
      where: { abrev },
      order: { id: 'ASC' },
      take: 100
    });
  }

  async findOneNivelAcoes(nivel: number): Promise<AcoesEntity | null> {
    return this.repo.findOne({
      where: { nivel }
    });
  }

  async findAllNivelAcoes(nivel: number): Promise<AcoesEntity[]> {
    return this.repo.find({
      where: { nivel },
      order: { id: 'ASC' },
      take: 100
    });
  }

  // ============================================================
  // * UTIL *
  // ============================================================
  private validateId(id: number): void {
    if (!id || isNaN(id) || id <= 0) {
      throw new Error('Invalid acoesId');
    }
  }
}

