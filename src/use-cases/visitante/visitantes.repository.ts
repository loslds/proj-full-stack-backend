  
// C:\repository\proj-full-stack-backend\src\use-cases\visitante\visitantes.controller.ts
// C:\repository\proj-full-stack-backend\src\use-cases\visitante\visitantes.repository.ts
import {
  DataSource,
  DeepPartial,
  FindOptionsWhere,
  FindOptionsOrder,
  Repository
} from 'typeorm';

import { VisitantesEntity } from './visitantes.entity';
import type { VisitantesCreate } from './visitantes.dto';

export class VisitantesRepository {
  private repo: Repository<VisitantesEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(VisitantesEntity);
  }

  // ============================================================
  // * DUPLICIDADE *
  // ============================================================
  async hasDuplicated(
    nome?: string,
    fantasy?: string,
    id_pessoas?: number,
    id_empresas?: number,
    excludes: number[] = []
  ): Promise<VisitantesEntity | null> {
    const query = this.repo.createQueryBuilder('visitantes');

    if (nome) {
      query.andWhere('visitantes.nome = :nome', { nome });
    }

    if (fantasy) {
      query.andWhere('visitantes.fantasy = :fantasy', { fantasy });
    }

    if (typeof id_pessoas === 'number') {
      query.andWhere('visitantes.id_pessoas = :id_pessoas', { id_pessoas });
    }

    if (typeof id_empresas === 'number') {
      query.andWhere('visitantes.id_empresas = :id_empresas', { id_empresas });
    }

    if (excludes.length > 0) {
      query.andWhere('visitantes.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }

  // ============================================================
  // * CRUD *
  // ============================================================
  async findVisitantesAll(
    where?:
      | FindOptionsWhere<VisitantesEntity>
      | FindOptionsWhere<VisitantesEntity>[],
    orderBy: FindOptionsOrder<VisitantesEntity> = { id: 'ASC' }
  ): Promise<VisitantesEntity[]> {
    return this.repo.find({
      where,
      relations: {
        pessoas: true,
        empresas: true
      },
      order: orderBy
    });
  }

  async createVisitantes(
    visitantes: VisitantesCreate
  ): Promise<VisitantesEntity> {
    const duplicated = await this.hasDuplicated(
      visitantes.nome,
      visitantes.fantasy,
      visitantes.id_pessoas,
      visitantes.id_empresas
    );

    if (duplicated) {
      throw new Error(
        'Visitante duplicado! Nome, fantasy, pessoa e empresa já existentes.'
      );
    }

    const data = this.repo.create({
      ...visitantes,
      createdBy: visitantes.createdBy ?? 0,
      updatedBy: visitantes.updatedBy ?? 0
    });

    return this.repo.save(data);
  }

  async findOneVisitantesById(
    visitantesId: number
  ): Promise<VisitantesEntity | null> {
    this.validateId(visitantesId);

    return this.repo.findOne({
      where: { id: visitantesId },
      relations: {
        pessoas: true,
        empresas: true
      }
    });
  }

  async updateVisitantesId(
    visitantesId: number,
    visitantes: DeepPartial<VisitantesEntity>
  ): Promise<VisitantesEntity> {
    this.validateId(visitantesId);

    const current = await this.repo.findOne({
      where: { id: visitantesId }
    });

    if (!current) {
      throw new Error(`Visitante com ID ${visitantesId} não encontrado.`);
    }

    const duplicated = await this.hasDuplicated(
      visitantes.nome ?? current.nome,
      visitantes.fantasy ?? current.fantasy,
      visitantes.id_pessoas ?? current.id_pessoas,
      visitantes.id_empresas ?? current.id_empresas,
      [visitantesId]
    );

    if (duplicated) {
      throw new Error(
        'Visitante duplicado! Nome, fantasy, pessoa e empresa já existentes.'
      );
    }

    const data = this.repo.create({
      ...current,
      ...visitantes,
      id: visitantesId
    });

    return this.repo.save(data);
  }

  async deleteVisitantesId(visitantesId: number): Promise<boolean> {
    this.validateId(visitantesId);

    const result = await this.repo.delete(visitantesId);

    if (result.affected === 0) {
      throw new Error(`Visitante com ID ${visitantesId} não encontrado.`);
    }

    return true;
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================

  async findOneVisitantesByNome(
    nome: string
  ): Promise<VisitantesEntity | null> {
    return this.repo.findOne({
      where: { nome },
      relations: {
        pessoas: true,
        empresas: true
      }
    });
  }

  async findAllVisitantesByNome(
    nome: string
  ): Promise<VisitantesEntity[]> {
    return this.repo.find({
      where: { nome },
      relations: {
        pessoas: true,
        empresas: true
      },
      order: { id: 'ASC' }
    });
  }

  async findOneVisitantesByFantasy(
    fantasy: string
  ): Promise<VisitantesEntity | null> {
    return this.repo.findOne({
      where: { fantasy },
      relations: {
        pessoas: true,
        empresas: true
      }
    });
  }

  async findAllVisitantesByFantasy(
    fantasy: string
  ): Promise<VisitantesEntity[]> {
    return this.repo.find({
      where: { fantasy },
      relations: {
        pessoas: true,
        empresas: true
      },
      order: { id: 'ASC' }
    });
  }

  async searchNameParcialVisitantes(
    txt?: string
  ): Promise<VisitantesEntity[]> {
    const query = this.repo
      .createQueryBuilder('visitantes')
      .leftJoinAndSelect('visitantes.pessoas', 'pessoas')
      .leftJoinAndSelect('visitantes.empresas', 'empresas')
      .orderBy('visitantes.nome', 'ASC');

    if (txt && txt.trim() !== '') {
      query.andWhere(
        'visitantes.nome LIKE :txt COLLATE utf8mb4_general_ci',
        { txt: `%${txt}%` }
      );
    }

    return query.getMany();
  }

  async searchFantasyParcialVisitantes(
    txt?: string
  ): Promise<VisitantesEntity[]> {
    const query = this.repo
      .createQueryBuilder('visitantes')
      .leftJoinAndSelect('visitantes.pessoas', 'pessoas')
      .leftJoinAndSelect('visitantes.empresas', 'empresas')
      .orderBy('visitantes.fantasy', 'ASC');

    if (txt && txt.trim() !== '') {
      query.andWhere(
        'visitantes.fantasy LIKE :txt COLLATE utf8mb4_general_ci',
        { txt: `%${txt}%` }
      );
    }

    return query.getMany();
  }

  async searchVisitantes(params: {
    id?: number;
    nome?: string;
    fantasy?: string;
    id_pessoas?: number;
    id_empresas?: number;
  }): Promise<VisitantesEntity[]> {
    const query = this.repo
      .createQueryBuilder('visitantes')
      .leftJoinAndSelect('visitantes.pessoas', 'pessoas')
      .leftJoinAndSelect('visitantes.empresas', 'empresas')
      .orderBy('visitantes.id', 'ASC');

    if (typeof params.id === 'number') {
      query.andWhere('visitantes.id = :id', { id: params.id });
    }

    if (params.nome) {
      query.andWhere(
        'visitantes.nome LIKE :nome COLLATE utf8mb4_general_ci',
        { nome: `%${params.nome}%` }
      );
    }

    if (params.fantasy) {
      query.andWhere(
        'visitantes.fantasy LIKE :fantasy COLLATE utf8mb4_general_ci',
        { fantasy: `%${params.fantasy}%` }
      );
    }

    if (typeof params.id_pessoas === 'number') {
      query.andWhere('visitantes.id_pessoas = :id_pessoas', {
        id_pessoas: params.id_pessoas
      });
    }

    if (typeof params.id_empresas === 'number') {
      query.andWhere('visitantes.id_empresas = :id_empresas', {
        id_empresas: params.id_empresas
      });
    }

    return query.getMany();
  }

  async findAllVisitantesByPessoasId(
    pessoasId: number
  ): Promise<VisitantesEntity[]> {
    return this.repo.find({
      where: { id_pessoas: pessoasId },
      relations: {
        pessoas: true,
        empresas: true
      },
      order: { id: 'ASC' }
    });
  }

  async findAllVisitantesByEmpresasId(
    empresasId: number
  ): Promise<VisitantesEntity[]> {
    return this.repo.find({
      where: { id_empresas: empresasId },
      relations: {
        pessoas: true,
        empresas: true
      },
      order: { id: 'ASC' }
    });
  }

  async listAllVisitantesDetails(): Promise<VisitantesEntity[]> {
    return this.repo
      .createQueryBuilder('visitantes')
      .leftJoinAndSelect('visitantes.pessoas', 'pessoas')
      .leftJoinAndSelect('visitantes.empresas', 'empresas')
      .orderBy('visitantes.id', 'ASC')
      .getMany();
  }

  // ============================================================
  // * UTIL *
  // ============================================================
  private validateId(id: number): void {
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      throw new Error('Invalid visitantesId');
    }
  }
}