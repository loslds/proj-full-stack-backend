
// C:\repository\proj-full-stack-backend\src\use-cases\grpservico\grpservicos.repository.ts

import {
  DataSource,
  DeepPartial,
  FindOptionsWhere,
  FindOptionsOrder,
  Repository
} from 'typeorm';

import { GrpServicosEntity } from './grpservicos.entity';
import type { GrpServicosCreate } from './grpservicos.dto';


export class GrpServicosRepository {
  private repo: Repository<GrpServicosEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(GrpServicosEntity);
  }


  // ============================================================
  // * DUPLICIDADE *
  // ============================================================

  async hasDuplicated(
    nome?: string,
    excludes: number[] = []
  ): Promise<GrpServicosEntity | null> {

    const query = this.repo.createQueryBuilder('grpservicos');

    if (nome) {
      query.andWhere(
        'grpservicos.nome = :nome',
        { nome }
      );
    }

    if (excludes.length > 0) {
      query.andWhere(
        'grpservicos.id NOT IN (:...excludes)',
        { excludes }
      );
    }

    return query.getOne();
  }


  // ============================================================
  // * CRUD *
  // ============================================================

  async findGrpServicosAll(
    where?:
      | FindOptionsWhere<GrpServicosEntity>
      | FindOptionsWhere<GrpServicosEntity>[],
    orderBy: FindOptionsOrder<GrpServicosEntity> = { id: 'ASC' }
  ): Promise<GrpServicosEntity[]> {

    return this.repo.find({
      where,
      order: orderBy
    });
  }


  async createGrpServicos(
    grpservicos: GrpServicosCreate
  ): Promise<GrpServicosEntity> {

    const duplicated = await this.hasDuplicated(
      grpservicos.nome
    );

    if (duplicated) {
      throw new Error(
        `Grupo de serviço duplicado! Já existe registro com nome "${grpservicos.nome}".`
      );
    }

    const data = this.repo.create({
      ...grpservicos,
      createdBy: grpservicos.createdBy ?? 0,
      updatedBy: grpservicos.updatedBy ?? 0
    });

    return this.repo.save(data);
  }


  async findOneGrpServicosById(
    grpservicosId: number
  ): Promise<GrpServicosEntity | null> {

    this.validateId(grpservicosId);

    return this.repo.findOne({
      where: {
        id: grpservicosId
      }
    });
  }


  async updateGrpServicosId(
    grpservicosId: number,
    grpservicos: DeepPartial<GrpServicosEntity>
  ): Promise<GrpServicosEntity> {

    this.validateId(grpservicosId);

    const current = await this.repo.findOne({
      where: {
        id: grpservicosId
      }
    });

    if (!current) {
      throw new Error(
        `Grupo de serviço com ID ${grpservicosId} não encontrado.`
      );
    }

    const duplicated = await this.hasDuplicated(
      grpservicos.nome ?? current.nome,
      [grpservicosId]
    );

    if (duplicated) {
      throw new Error(
        `Grupo de serviço duplicado! Já existe registro com nome "${grpservicos.nome ?? current.nome}".`
      );
    }

    const data = this.repo.create({
      ...current,
      ...grpservicos,
      id: grpservicosId
    });

    return this.repo.save(data);
  }


  async deleteGrpServicosId(
    grpservicosId: number
  ): Promise<boolean> {

    this.validateId(grpservicosId);

    const result = await this.repo.delete(
      grpservicosId
    );

    if (result.affected === 0) {
      throw new Error(
        `Grupo de serviço com ID ${grpservicosId} não encontrado.`
      );
    }

    return true;
  }


  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================

  async findOneGrpServicosByNome(
    nome: string
  ): Promise<GrpServicosEntity | null> {

    return this.repo.findOne({
      where: {
        nome
      }
    });
  }


  async findAllGrpServicosByNome(
    nome: string
  ): Promise<GrpServicosEntity[]> {

    return this.repo.find({
      where: {
        nome
      },
      order: {
        id: 'ASC'
      }
    });
  }


  async searchNameParcialGrpServicos(
    txt?: string
  ): Promise<GrpServicosEntity[]> {

    const query = this.repo
      .createQueryBuilder('grpservicos')
      .orderBy('grpservicos.nome', 'ASC');

    if (txt && txt.trim() !== '') {
      query.andWhere(
        'grpservicos.nome LIKE :txt COLLATE utf8mb4_general_ci',
        {
          txt: `%${txt}%`
        }
      );
    }

    return query.getMany();
  }


  async searchGrpServicos(params: {
    id?: number;
    nome?: string;
  }): Promise<GrpServicosEntity[]> {

    const query = this.repo
      .createQueryBuilder('grpservicos')
      .orderBy('grpservicos.id', 'ASC');

    if (typeof params.id === 'number') {
      query.andWhere(
        'grpservicos.id = :id',
        {
          id: params.id
        }
      );
    }

    if (params.nome) {
      query.andWhere(
        'grpservicos.nome LIKE :nome COLLATE utf8mb4_general_ci',
        {
          nome: `%${params.nome}%`
        }
      );
    }

    return query.getMany();
  }


  // ============================================================
  // * UTIL *
  // ============================================================

  private validateId(id: number): void {

    if (
      typeof id !== 'number' ||
      isNaN(id) ||
      id <= 0
    ) {
      throw new Error(
        'Invalid grpservicosId'
      );
    }
  }
}