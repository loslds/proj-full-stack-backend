
// C:\repository\proj-full-stack-backend\src\use-cases\funcionario\funcionarios.repository.ts

import {
  DataSource,
  DeepPartial,
  FindOptionsWhere,
  FindOptionsOrder,
  Repository
} from 'typeorm';

import { FuncionariosEntity } from './funcionarios.entity';
import type { FuncionariosCreate } from './funcionarios.dto';

export class FuncionariosRepository {
  private repo: Repository<FuncionariosEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(FuncionariosEntity);
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
  ): Promise<FuncionariosEntity | null> {
    const query = this.repo.createQueryBuilder('funcionarios');

    if (nome) {
      query.andWhere('funcionarios.nome = :nome', { nome });
    }

    if (fantasy) {
      query.andWhere('funcionarios.fantasy = :fantasy', { fantasy });
    }

    if (typeof id_pessoas === 'number') {
      query.andWhere('funcionarios.id_pessoas = :id_pessoas', { id_pessoas });
    }

    if (typeof id_empresas === 'number') {
      query.andWhere('funcionarios.id_empresas = :id_empresas', { id_empresas });
    }

    if (excludes.length > 0) {
      query.andWhere('funcionarios.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }

  // ============================================================
  // * CRUD *
  // ============================================================
  async findFuncionariosAll(
    where?:
      | FindOptionsWhere<FuncionariosEntity>
      | FindOptionsWhere<FuncionariosEntity>[],
    orderBy: FindOptionsOrder<FuncionariosEntity> = { id: 'ASC' }
  ): Promise<FuncionariosEntity[]> {
    return this.repo.find({
      where,
      relations: {
        pessoas: true,
        empresas: true
      },
      order: orderBy
    });
  }

  async createFuncionarios(
    funcionarios: FuncionariosCreate
  ): Promise<FuncionariosEntity> {
    const duplicated = await this.hasDuplicated(
      funcionarios.nome,
      funcionarios.fantasy,
      funcionarios.id_pessoas,
      funcionarios.id_empresas
    );

    if (duplicated) {
      throw new Error(
        'Funcionário duplicado! Nome, fantasy, pessoa e empresa já existentes.'
      );
    }

    const data = this.repo.create({
      ...funcionarios,
      createdBy: funcionarios.createdBy ?? 0,
      updatedBy: funcionarios.updatedBy ?? 0
    });

    return this.repo.save(data);
  }

  async findOneFuncionariosById(
    funcionariosId: number
  ): Promise<FuncionariosEntity | null> {
    this.validateId(funcionariosId);

    return this.repo.findOne({
      where: { id: funcionariosId },
      relations: {
        pessoas: true,
        empresas: true
      }
    });
  }

  async updateFuncionariosId(
    funcionariosId: number,
    funcionarios: DeepPartial<FuncionariosEntity>
  ): Promise<FuncionariosEntity> {
    this.validateId(funcionariosId);

    const current = await this.repo.findOne({
      where: { id: funcionariosId }
    });

    if (!current) {
      throw new Error(`Funcionário com ID ${funcionariosId} não encontrado.`);
    }

    const duplicated = await this.hasDuplicated(
      funcionarios.nome ?? current.nome,
      funcionarios.fantasy ?? current.fantasy,
      funcionarios.id_pessoas ?? current.id_pessoas,
      funcionarios.id_empresas ?? current.id_empresas,
      [funcionariosId]
    );

    if (duplicated) {
      throw new Error(
        'Funcionário duplicado! Nome, fantasy, pessoa e empresa já existentes.'
      );
    }

    const data = this.repo.create({
      ...current,
      ...funcionarios,
      id: funcionariosId
    });

    return this.repo.save(data);
  }

  async deleteFuncionariosId(funcionariosId: number): Promise<boolean> {
    this.validateId(funcionariosId);

    const result = await this.repo.delete(funcionariosId);

    if (result.affected === 0) {
      throw new Error(`Funcionário com ID ${funcionariosId} não encontrado.`);
    }

    return true;
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================
  async findOneFuncionariosByNome(
    nome: string
  ): Promise<FuncionariosEntity | null> {
    return this.repo.findOne({
      where: { nome },
      relations: {
        pessoas: true,
        empresas: true
      }
    });
  }

  async findAllFuncionariosByNome(
    nome: string
  ): Promise<FuncionariosEntity[]> {
    return this.repo.find({
      where: { nome },
      relations: {
        pessoas: true,
        empresas: true
      },
      order: { id: 'ASC' }
    });
  }

  async findOneFuncionariosByFantasy(
    fantasy: string
  ): Promise<FuncionariosEntity | null> {
    return this.repo.findOne({
      where: { fantasy },
      relations: {
        pessoas: true,
        empresas: true
      }
    });
  }

  async findAllFuncionariosByFantasy(
    fantasy: string
  ): Promise<FuncionariosEntity[]> {
    return this.repo.find({
      where: { fantasy },
      relations: {
        pessoas: true,
        empresas: true
      },
      order: { id: 'ASC' }
    });
  }

  async searchNameParcialFuncionarios(
    txt?: string
  ): Promise<FuncionariosEntity[]> {
    const query = this.repo
      .createQueryBuilder('funcionarios')
      .leftJoinAndSelect('funcionarios.pessoas', 'pessoas')
      .leftJoinAndSelect('funcionarios.empresas', 'empresas')
      .orderBy('funcionarios.nome', 'ASC');

    if (txt && txt.trim() !== '') {
      query.andWhere(
        'funcionarios.nome LIKE :txt COLLATE utf8mb4_general_ci',
        { txt: `%${txt}%` }
      );
    }

    return query.getMany();
  }

  async searchFantasyParcialFuncionarios(
    txt?: string
  ): Promise<FuncionariosEntity[]> {
    const query = this.repo
      .createQueryBuilder('funcionarios')
      .leftJoinAndSelect('funcionarios.pessoas', 'pessoas')
      .leftJoinAndSelect('funcionarios.empresas', 'empresas')
      .orderBy('funcionarios.fantasy', 'ASC');

    if (txt && txt.trim() !== '') {
      query.andWhere(
        'funcionarios.fantasy LIKE :txt COLLATE utf8mb4_general_ci',
        { txt: `%${txt}%` }
      );
    }

    return query.getMany();
  }

  async searchFuncionarios(params: {
    id?: number;
    nome?: string;
    fantasy?: string;
    id_pessoas?: number;
    id_empresas?: number;
  }): Promise<FuncionariosEntity[]> {
    const query = this.repo
      .createQueryBuilder('funcionarios')
      .leftJoinAndSelect('funcionarios.pessoas', 'pessoas')
      .leftJoinAndSelect('funcionarios.empresas', 'empresas')
      .orderBy('funcionarios.id', 'ASC');

    if (typeof params.id === 'number') {
      query.andWhere('funcionarios.id = :id', { id: params.id });
    }

    if (params.nome) {
      query.andWhere(
        'funcionarios.nome LIKE :nome COLLATE utf8mb4_general_ci',
        { nome: `%${params.nome}%` }
      );
    }

    if (params.fantasy) {
      query.andWhere(
        'funcionarios.fantasy LIKE :fantasy COLLATE utf8mb4_general_ci',
        { fantasy: `%${params.fantasy}%` }
      );
    }

    if (typeof params.id_pessoas === 'number') {
      query.andWhere('funcionarios.id_pessoas = :id_pessoas', {
        id_pessoas: params.id_pessoas
      });
    }

    if (typeof params.id_empresas === 'number') {
      query.andWhere('funcionarios.id_empresas = :id_empresas', {
        id_empresas: params.id_empresas
      });
    }

    return query.getMany();
  }

  async findAllFuncionariosByPessoasId(
    pessoasId: number
  ): Promise<FuncionariosEntity[]> {
    return this.repo.find({
      where: { id_pessoas: pessoasId },
      relations: {
        pessoas: true,
        empresas: true
      },
      order: { id: 'ASC' }
    });
  }

  async findAllFuncionariosByEmpresasId(
    empresasId: number
  ): Promise<FuncionariosEntity[]> {
    return this.repo.find({
      where: { id_empresas: empresasId },
      relations: {
        pessoas: true,
        empresas: true
      },
      order: { id: 'ASC' }
    });
  }

  async listAllFuncionariosDetails(): Promise<FuncionariosEntity[]> {
    return this.repo
      .createQueryBuilder('funcionarios')
      .leftJoinAndSelect('funcionarios.pessoas', 'pessoas')
      .leftJoinAndSelect('funcionarios.empresas', 'empresas')
      .orderBy('funcionarios.id', 'ASC')
      .getMany();
  }

  // ============================================================
  // * UTIL *
  // ============================================================
  private validateId(id: number): void {
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      throw new Error('Invalid funcionariosId');
    }
  }
}