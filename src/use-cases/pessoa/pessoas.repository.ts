 
// src/use-cases/pessoa/pessoas.repository.ts
import {
  DataSource,
  DeepPartial,
  Repository,
  FindOptionsWhere,
  FindOptionsOrder
} from 'typeorm';

import { PessoasEntity } from './pessoas.entity';
import type { PessoasCreate } from './pessoas.dto';

export class PessoasRepository {
  private repo: Repository<PessoasEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(PessoasEntity);
  }

  // ============================================================
  // * DUPLICIDADE *
  // ============================================================

  async hasDuplicated(
    nome?: string,
    sigla?: string,
    excludeId?: number
  ): Promise<boolean> {
    const query = this.repo
      .createQueryBuilder('pessoas')
      .select(['pessoas.id']);

    if (nome) {
      query.andWhere('pessoas.nome = :nome', { nome });
    }

    if (sigla) {
      query.andWhere('pessoas.sigla = :sigla', { sigla });
    }

    if (excludeId) {
      query.andWhere('pessoas.id != :excludeId', { excludeId });
    }

    const result = await query.getOne();
    return !!result;
  }

  // ============================================================
  // * CRUD *
  // ============================================================

  async findPessoasAll(
    where?: FindOptionsWhere<PessoasEntity>,
    order?: FindOptionsOrder<PessoasEntity>
  ): Promise<PessoasEntity[]> {
    return this.repo.find({ where, order });
  }

  async createPessoas(pessoas: PessoasCreate): Promise<PessoasEntity> {
    const exists = await this.hasDuplicated(pessoas.nome, pessoas.sigla);

    if (exists) {
      throw new Error(
        `Pessoa duplicada! Já existe registro com nome "${pessoas.nome}" e sigla "${pessoas.sigla}".`
      );
    }

    const entity = this.repo.create({
      ...pessoas,
      createdBy: pessoas.createdBy ?? 0,
      updatedBy: pessoas.updatedBy ?? 0
    });

    return this.repo.save(entity);
  }

  async findPessoasById(pessoasId: number): Promise<PessoasEntity | null> {
    this.validateId(pessoasId);

    return this.repo.findOne({
      where: { id: pessoasId }
    });
  }

  async updatePessoas(
    pessoasId: number,
    pessoas: DeepPartial<PessoasEntity>
  ): Promise<PessoasEntity> {
    this.validateId(pessoasId);

    const current = await this.repo.findOne({
      where: { id: pessoasId }
    });

    if (!current) {
      throw new Error(`Pessoa com id ${pessoasId} não encontrada`);
    }

    const nome = pessoas.nome ?? current.nome;
    const sigla = pessoas.sigla ?? current.sigla;

    const exists = await this.hasDuplicated(nome, sigla, pessoasId);

    if (exists) {
      throw new Error(
        `Pessoa duplicada! Já existe registro com nome "${nome}" e sigla "${sigla}".`
      );
    }

    const entity = await this.repo.preload({
      id: pessoasId,
      ...pessoas
    });

    if (!entity) {
      throw new Error(`Pessoa com id ${pessoasId} não encontrada`);
    }

    return this.repo.save(entity);
  }

  async deletePessoas(pessoasId: number): Promise<void> {
    this.validateId(pessoasId);

    const found = await this.repo.findOne({
      where: { id: pessoasId }
    });

    if (!found) {
      throw new Error(`Pessoa com id ${pessoasId} não encontrada`);
    }

    await this.repo.remove(found);
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================

  async searchPessoas(params: {
    id?: number;
    nome?: string;
    sigla?: string;
  }): Promise<PessoasEntity[]> {
    const query = this.repo
      .createQueryBuilder('pessoas')
      .select(['pessoas.id', 'pessoas.nome', 'pessoas.sigla'])
      .orderBy('pessoas.id', 'ASC');

    if (params.id) {
      query.andWhere('pessoas.id = :id', { id: params.id });
    }

    if (params.nome) {
      query.andWhere('pessoas.nome LIKE :nome COLLATE utf8mb4_general_ci', {
        nome: `%${params.nome}%`
      });
    }

    if (params.sigla) {
      query.andWhere('pessoas.sigla LIKE :sigla COLLATE utf8mb4_general_ci', {
        sigla: `%${params.sigla}%`
      });
    }

    return query.getMany();
  }

  async searchNomePessoas(text?: string): Promise<PessoasEntity[]> {
    const query = this.repo
      .createQueryBuilder('pessoas')
      .select(['pessoas.id', 'pessoas.nome', 'pessoas.sigla'])
      .orderBy('pessoas.id', 'ASC')
      .limit(100);

    if (text) {
      query.andWhere('pessoas.nome LIKE :text COLLATE utf8mb4_general_ci', {
        text: `%${text}%`
      });
    }

    return query.getMany();
  }

  async searchSiglaPessoas(text?: string): Promise<PessoasEntity[]> {
    const query = this.repo
      .createQueryBuilder('pessoas')
      .select(['pessoas.id', 'pessoas.nome', 'pessoas.sigla'])
      .orderBy('pessoas.id', 'ASC')
      .limit(100);

    if (text) {
      query.andWhere('pessoas.sigla LIKE :text COLLATE utf8mb4_general_ci', {
        text: `%${text}%`
      });
    }

    return query.getMany();
  }

  async findOneNomePessoas(nome: string): Promise<PessoasEntity | null> {
    return this.repo.findOne({ where: { nome } });
  }

  async findAllNomePessoas(nome: string): Promise<PessoasEntity[]> {
    return this.repo.find({
      where: { nome },
      order: { id: 'ASC' },
      take: 100
    });
  }

  async findOneSiglaPessoas(sigla: string): Promise<PessoasEntity | null> {
    return this.repo.findOne({ where: { sigla } });
  }

  async findAllSiglaPessoas(sigla: string): Promise<PessoasEntity[]> {
    return this.repo.find({
      where: { sigla },
      order: { id: 'ASC' },
      take: 100
    });
  }

  // ============================================================
  // * UTIL *
  // ============================================================

  private validateId(id: number): void {
    if (!id || isNaN(id) || id <= 0) {
      throw new Error('Invalid pessoasId');
    }
  }
}

