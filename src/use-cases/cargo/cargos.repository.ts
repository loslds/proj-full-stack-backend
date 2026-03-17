
//C:\repository\proj-full-stack-backend\src\use-cases\cargo\cargos.repository.ts
import {
  DataSource,
  DeepPartial,
  Repository,
  FindOptionsWhere,
  FindOptionsOrder
} from 'typeorm';

import { CargosEntity } from './cargos.entity';
import type { CargosCreate } from './cargos.dto';

export class CargosRepository {
  private repo: Repository<CargosEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(CargosEntity);
  }

  // ============================================================
  // * DUPLICIDADE *
  // ============================================================
  async hasDuplicated(
    nome?: string,
    excludeId?: number
  ): Promise<boolean> {
    const query = this.repo
      .createQueryBuilder('cargos')
      .select(['cargos.id']);

    if (nome) {
      query.andWhere('cargos.nome = :nome', { nome });
    }

    if (excludeId) {
      query.andWhere('cargos.id != :excludeId', { excludeId });
    }

    const result = await query.getOne();
    return !!result;
  }

  // ============================================================
  // * CRUD *
  // ============================================================
  async findCargosAll(
    where?: FindOptionsWhere<CargosEntity>,
    order?: FindOptionsOrder<CargosEntity>
  ): Promise<CargosEntity[]> {
    return this.repo.find({ where, order });
  }

  async createCargos(cargos: CargosCreate): Promise<CargosEntity> {
    const exists = await this.hasDuplicated(cargos.nome);

    if (exists) {
      throw new Error(
        `Cargo duplicado! Já existe registro com nome "${cargos.nome}".`
      );
    }

    const entity = this.repo.create({
      ...cargos,
      createdBy: cargos.createdBy ?? 0,
      updatedBy: cargos.updatedBy ?? 0
    });

    return this.repo.save(entity);
  }

  async findCargosById(cargosId: number): Promise<CargosEntity | null> {
    this.validateId(cargosId);

    return this.repo.findOne({
      where: { id: cargosId }
    });
  }

  async updateCargos(
    cargosId: number,
    cargos: DeepPartial<CargosEntity>
  ): Promise<CargosEntity> {
    this.validateId(cargosId);

    const current = await this.repo.findOne({
      where: { id: cargosId }
    });

    if (!current) {
      throw new Error(`Cargo com id ${cargosId} não encontrado`);
    }

    const nome = cargos.nome ?? current.nome;

    const exists = await this.hasDuplicated(nome, cargosId);

    if (exists) {
      throw new Error(
        `Cargo duplicado! Já existe registro com nome "${nome}".`
      );
    }

    const entity = await this.repo.preload({
      id: cargosId,
      ...cargos
    });

    if (!entity) {
      throw new Error(`Cargo com id ${cargosId} não encontrado`);
    }

    return this.repo.save(entity);
  }

  async deleteCargos(cargosId: number): Promise<void> {
    this.validateId(cargosId);

    const found = await this.repo.findOne({
      where: { id: cargosId }
    });

    if (!found) {
      throw new Error(`Cargo com id ${cargosId} não encontrado`);
    }

    await this.repo.remove(found);
  }


  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================
  async searchCargos(params: {
    id?: number;
    nome?: string;
    
  }): Promise<CargosEntity[]> {
    const query = this.repo
      .createQueryBuilder('cargos')
      .select(['cargos.id', 'cargos.nome'])
      .orderBy('cargos.id', 'ASC');

    if (params.id) {
      query.andWhere('cargos.id = :id', { id: params.id });
    }

    if (params.nome) {
      query.andWhere(
        'cargos.nome LIKE :nome COLLATE utf8mb4_general_ci',
        { nome: `%${params.nome}%` }
      );
    }

    return query.getMany();
  }

  async searchNomeCargos(text?: string): Promise<CargosEntity[]> {
    const query = this.repo
      .createQueryBuilder('cargos')
      .select(['cargos.id', 'cargos.nome'])
      .orderBy('cargos.id', 'ASC')
      .limit(100);

    if (text) {
      query.andWhere(
        'cargos.nome LIKE :text COLLATE utf8mb4_general_ci',
        { text: `%${text}%` }
      );
    }

    return query.getMany();
  }

  async findOneNomeCargos(nome: string): Promise<CargosEntity | null> {
    return this.repo.findOne({
      where: { nome }
    });
  }

  async findAllNomeCargos(nome: string): Promise<CargosEntity[]> {
    return this.repo.find({
      where: { nome },
      order: { id: 'ASC' },
      take: 100
    });
  }

  // ============================================================
  // * UTIL *
  // ============================================================
  private validateId(id: number): void {
    if (!id || isNaN(id) || id <= 0) {
      throw new Error('Invalid cargosId');
    }
  }
}