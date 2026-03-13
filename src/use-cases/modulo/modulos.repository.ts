
// C:\repository\proj-full-stack-backend\src\use-cases\modulo\modulos.repository.ts

import {
  DataSource,
  DeepPartial,
  Repository,
  FindOptionsWhere,
  FindOptionsOrder
} from 'typeorm';

import { ModulosEntity } from './modulos.entity';
import type { ModulosCreate } from './modulos.dto';

export class ModulosRepository {
  private repo: Repository<ModulosEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(ModulosEntity);
  }

  // ============================================================
  // * DUPLICIDADE *
  // ============================================================
  async hasDuplicated(
    name?: string,
    excludeId?: number
  ): Promise<boolean> {
    const query = this.repo
      .createQueryBuilder('modulos')
      .select(['modulos.id']);

    if (name) {
      query.andWhere('modulos.name = :name', { name });
    }

    if (excludeId) {
      query.andWhere('modulos.id != :excludeId', { excludeId });
    }

    const result = await query.getOne();
    return !!result;
  }

  // ============================================================
  // * CRUD *
  // ============================================================
  async findModulosAll(
    where?: FindOptionsWhere<ModulosEntity>,
    order?: FindOptionsOrder<ModulosEntity>
  ): Promise<ModulosEntity[]> {
    return this.repo.find({ where, order });
  }

  async createModulos(modulos: ModulosCreate): Promise<ModulosEntity> {
    const exists = await this.hasDuplicated(modulos.name);

    if (exists) {
      throw new Error(
        `Módulo duplicado! Já existe registro com nome "${modulos.name}".`
      );
    }

    const entity = this.repo.create({
      ...modulos,
      createdBy: modulos.createdBy ?? 0,
      updatedBy: modulos.updatedBy ?? 0
    });

    return this.repo.save(entity);
  }

  async findModulosById(modulosId: number): Promise<ModulosEntity | null> {
    this.validateId(modulosId);

    return this.repo.findOne({
      where: { id: modulosId }
    });
  }

  async updateModulos(
    modulosId: number,
    modulos: DeepPartial<ModulosEntity>
  ): Promise<ModulosEntity> {
    this.validateId(modulosId);

    const current = await this.repo.findOne({
      where: { id: modulosId }
    });

    if (!current) {
      throw new Error(`Módulo com id ${modulosId} não encontrado`);
    }

    const name = modulos.name ?? current.name;

    const exists = await this.hasDuplicated(name, modulosId);

    if (exists) {
      throw new Error(
        `Módulo duplicado! Já existe registro com nome "${name}".`
      );
    }

    const entity = await this.repo.preload({
      id: modulosId,
      ...modulos
    });

    if (!entity) {
      throw new Error(`Módulo com id ${modulosId} não encontrado`);
    }

    return this.repo.save(entity);
  }

  async deleteModulos(modulosId: number): Promise<void> {
    this.validateId(modulosId);

    const found = await this.repo.findOne({
      where: { id: modulosId }
    });

    if (!found) {
      throw new Error(`Módulo com id ${modulosId} não encontrado`);
    }

    await this.repo.remove(found);
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================
  async searchModulos(params: {
    id?: number;
    name?: string;
  }): Promise<ModulosEntity[]> {
    const query = this.repo
      .createQueryBuilder('modulos')
      .select(['modulos.id', 'modulos.name'])
      .orderBy('modulos.id', 'ASC');

    if (params.id) {
      query.andWhere('modulos.id = :id', { id: params.id });
    }

    if (params.name) {
      query.andWhere(
        'modulos.name LIKE :name COLLATE utf8mb4_general_ci',
        { name: `%${params.name}%` }
      );
    }

    return query.getMany();
  }

  async searchNameModulos(text?: string): Promise<ModulosEntity[]> {
    const query = this.repo
      .createQueryBuilder('modulos')
      .select(['modulos.id', 'modulos.name'])
      .orderBy('modulos.id', 'ASC')
      .limit(100);

    if (text) {
      query.andWhere(
        'modulos.name LIKE :text COLLATE utf8mb4_general_ci',
        { text: `%${text}%` }
      );
    }

    return query.getMany();
  }

  async findOneNameModulos(name: string): Promise<ModulosEntity | null> {
    return this.repo.findOne({
      where: { name }
    });
  }

  async findAllNameModulos(name: string): Promise<ModulosEntity[]> {
    return this.repo.find({
      where: { name },
      order: { id: 'ASC' },
      take: 100
    });
  }

  // ============================================================
  // * UTIL *
  // ============================================================
  private validateId(id: number): void {
    if (!id || isNaN(id) || id <= 0) {
      throw new Error('Invalid modulosId');
    }
  }
}