// C:\repository\proj-full-stack-backend\src\use-cases\empresa\empresas.repository.ts
import {
  DataSource,
  DeepPartial,
  FindOptionsWhere,
  FindOptionsOrder,
  Repository
} from 'typeorm';

import { EmpresasEntity } from './empresas.entity';
import type { EmpresasCreate } from './empresas.dto';

export class EmpresasRepository {
  private repo: Repository<EmpresasEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(EmpresasEntity);
  }

  // ============================================================
  // * DUPLICIDADE *
  // ============================================================
  async hasDuplicated(
    nome?: string,
    fantasy?: string,
    id_pessoas?: number,
    excludes: number[] = []
  ): Promise<EmpresasEntity | null> {
    const query = this.repo.createQueryBuilder('empresas');

    if (nome) {
      query.andWhere('empresas.nome = :nome', { nome });
    }

    if (fantasy) {
      query.andWhere('empresas.fantasy = :fantasy', { fantasy });
    }

    if (typeof id_pessoas === 'number') {
      query.andWhere('empresas.id_pessoas = :id_pessoas', { id_pessoas });
    }

    if (excludes.length > 0) {
      query.andWhere('empresas.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }

  // ============================================================
  // * CRUD *
  // ============================================================
  async findEmpresasAll(
    where?:
      | FindOptionsWhere<EmpresasEntity>
      | FindOptionsWhere<EmpresasEntity>[],
    orderBy: FindOptionsOrder<EmpresasEntity> = { id: 'ASC' }
  ): Promise<EmpresasEntity[]> {
    return this.repo.find({
      where,
      relations: {
        pessoas: true
      },
      order: orderBy
    });
  }

  async createEmpresas(
    empresas: EmpresasCreate
  ): Promise<EmpresasEntity> {
    const duplicated = await this.hasDuplicated(
      empresas.nome,
      empresas.fantasy,
      empresas.id_pessoas
    );

    if (duplicated) {
      throw new Error(
        'Empresa duplicada! Nome, fantasy e pessoa já existentes.'
      );
    }

    const data = this.repo.create({
      ...empresas,
      id_pessoas: empresas.id_pessoas,
      createdBy: empresas.createdBy ?? 0,
      updatedBy: empresas.updatedBy ?? 0
    });

    return this.repo.save(data);
  }

  async findOneEmpresasById(
    empresasId: number
  ): Promise<EmpresasEntity | null> {
    this.validateId(empresasId);

    return this.repo.findOne({
      where: { id: empresasId },
      relations: {
        pessoas: true
      }
    });
  }

  async updateEmpresasId(
    empresasId: number,
    empresas: DeepPartial<EmpresasEntity>
  ): Promise<EmpresasEntity> {
    this.validateId(empresasId);

    const current = await this.repo.findOne({
      where: { id: empresasId }
    });

    if (!current) {
      throw new Error(`Empresa com ID ${empresasId} não encontrada.`);
    }

    const duplicated = await this.hasDuplicated(
      empresas.nome ?? current.nome,
      empresas.fantasy ?? current.fantasy,
      empresas.id_pessoas ?? current.id_pessoas,
      [empresasId]
    );

    if (duplicated) {
      throw new Error(
        'Empresa duplicada! Nome, fantasy e pessoa já existentes.'
      );
    }

    const data = this.repo.create({
      ...current,
      ...empresas,
      id: empresasId
    });

    return this.repo.save(data);
  }

  async deleteEmpresasId(empresasId: number): Promise<boolean> {
    this.validateId(empresasId);

    const result = await this.repo.delete(empresasId);

    if (result.affected === 0) {
      throw new Error(`Empresa com ID ${empresasId} não encontrada.`);
    }

    return true;
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================
  async findOneEmpresasByNome(
    nome: string
  ): Promise<EmpresasEntity | null> {
    return this.repo.findOne({
      where: { nome },
      relations: {
        pessoas: true
      }
    });
  }

  async findAllEmpresasByNome(nome: string): Promise<EmpresasEntity[]> {
    return this.repo.find({
      where: { nome },
      relations: {
        pessoas: true
      },
      order: { id: 'ASC' }
    });
  }

  async findOneEmpresasByFantasy(
    fantasy: string
  ): Promise<EmpresasEntity | null> {
    return this.repo.findOne({
      where: { fantasy },
      relations: {
        pessoas: true
      }
    });
  }

  async findAllEmpresasByFantasy(
    fantasy: string
  ): Promise<EmpresasEntity[]> {
    return this.repo.find({
      where: { fantasy },
      relations: {
        pessoas: true
      },
      order: { id: 'ASC' }
    });
  }

  async searchNameParcialEmpresas(
    txt?: string
  ): Promise<EmpresasEntity[]> {
    const query = this.repo
      .createQueryBuilder('empresas')
      .leftJoinAndSelect('empresas.pessoas', 'pessoas')
      .orderBy('empresas.nome', 'ASC');

    if (txt && txt.trim() !== '') {
      query.andWhere(
        'empresas.nome LIKE :txt COLLATE utf8mb4_general_ci',
        { txt: `%${txt}%` }
      );
    }

    return query.getMany();
  }

  async searchFantasyParcialEmpresas(
    txt?: string
  ): Promise<EmpresasEntity[]> {
    const query = this.repo
      .createQueryBuilder('empresas')
      .leftJoinAndSelect('empresas.pessoas', 'pessoas')
      .orderBy('empresas.fantasy', 'ASC');

    if (txt && txt.trim() !== '') {
      query.andWhere(
        'empresas.fantasy LIKE :txt COLLATE utf8mb4_general_ci',
        { txt: `%${txt}%` }
      );
    }

    return query.getMany();
  }

  async searchEmpresas(params: {
    id?: number;
    nome?: string;
    fantasy?: string;
    id_pessoas?: number;
  }): Promise<EmpresasEntity[]> {
    const query = this.repo
      .createQueryBuilder('empresas')
      .leftJoinAndSelect('empresas.pessoas', 'pessoas')
      .orderBy('empresas.id', 'ASC');

    if (typeof params.id === 'number') {
      query.andWhere('empresas.id = :id', { id: params.id });
    }

    if (params.nome) {
      query.andWhere(
        'empresas.nome LIKE :nome COLLATE utf8mb4_general_ci',
        { nome: `%${params.nome}%` }
      );
    }

    if (params.fantasy) {
      query.andWhere(
        'empresas.fantasy LIKE :fantasy COLLATE utf8mb4_general_ci',
        { fantasy: `%${params.fantasy}%` }
      );
    }

    if (typeof params.id_pessoas === 'number') {
      query.andWhere('empresas.id_pessoas = :id_pessoas', {
        id_pessoas: params.id_pessoas
      });
    }

    return query.getMany();
  }

  async findAllEmpresasByPessoasId(
    pessoasId: number
  ): Promise<EmpresasEntity[]> {
    return this.repo.find({
      where: { id_pessoas: pessoasId },
      relations: {
        pessoas: true
      },
      order: { id: 'ASC' }
    });
  }

  async listAllEmpresasDetails(): Promise<EmpresasEntity[]> {
    return this.repo
      .createQueryBuilder('empresas')
      .leftJoinAndSelect('empresas.pessoas', 'pessoas')
      .orderBy('empresas.id', 'ASC')
      .getMany();
  }

  // ============================================================
  // * UTIL *
  // ============================================================
  private validateId(id: number): void {
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      throw new Error('Invalid empresasId');
    }
  }
}