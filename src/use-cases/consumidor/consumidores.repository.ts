

//C:\repository\proj-full-stack-backend\src\use-cases\consumidor\consumidores.reposytory.ts
import {
  DataSource,
  DeepPartial,
  FindOptionsWhere,
  FindOptionsOrder,
  Repository
} from 'typeorm';

import { ConsumidoresEntity } from './consumidores.entity';
import type { ConsumidoresCreate } from './consumidores.dto';

export class ConsumidoresRepository {
  private repo: Repository<ConsumidoresEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(ConsumidoresEntity);
  }

  // ==========================================================
  // DUPLICIDADE
  // ==========================================================
  async hasDuplicated(
    nome?: string,
    fantasy?: string,
    id_pessoas?: number,
    id_empresas?: number,
    excludes: number[] = []
  ): Promise<ConsumidoresEntity | null> {
    const query = this.repo.createQueryBuilder('consumidores');

    if (nome) {
      query.andWhere('consumidores.nome = :nome', { nome });
    }

    if (fantasy) {
      query.andWhere('consumidores.fantasy = :fantasy', { fantasy });
    }

    if (typeof id_pessoas === 'number') {
      query.andWhere('consumidores.id_pessoas = :id_pessoas', { id_pessoas });
    }

    if (typeof id_empresas === 'number') {
      query.andWhere('consumidores.id_empresas = :id_empresas', { id_empresas });
    }

    if (excludes.length > 0) {
      query.andWhere('consumidores.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }

  // ==========================================================
  // CREATE
  // ==========================================================
  async createConsumidores(
    consumidores: ConsumidoresCreate
  ): Promise<ConsumidoresEntity> {
    const duplicated = await this.hasDuplicated(
      consumidores.nome,
      consumidores.fantasy,
      consumidores.id_pessoas,
      consumidores.id_empresas
    );

    if (duplicated) {
      throw new Error(
        'Consumidor duplicado! Nome, fantasy, pessoa e empresa já existentes.'
      );
    }

    const data = this.repo.create({
      ...consumidores,
      id_pessoas: consumidores.id_pessoas ?? 0,
      id_empresas: consumidores.id_empresas ?? 0,
      createdBy: consumidores.createdBy ?? 0,
      updatedBy: consumidores.updatedBy ?? 0
    });

    return this.repo.save(data);
  }

  // ==========================================================
  // UPDATE
  // ==========================================================
  async updateConsumidoresId(
    consumidoresId: number,
    consumidores: DeepPartial<ConsumidoresEntity>
  ): Promise<ConsumidoresEntity> {
    const current = await this.repo.findOne({
      where: { id: consumidoresId }
    });

    if (!current) {
      throw new Error(`Consumidor com ID ${consumidoresId} não encontrado.`);
    }

    const duplicated = await this.hasDuplicated(
      consumidores.nome ?? current.nome,
      consumidores.fantasy ?? current.fantasy,
      consumidores.id_pessoas ?? current.id_pessoas,
      consumidores.id_empresas ?? current.id_empresas,
      [consumidoresId]
    );

    if (duplicated) {
      throw new Error(
        'Consumidor duplicado! Nome, fantasy, pessoa e empresa já existentes.'
      );
    }

    const data = this.repo.create({
      ...current,
      ...consumidores,
      id: consumidoresId
    });

    return this.repo.save(data);
  }

  // ==========================================================
  // DELETE
  // ==========================================================
  async deleteConsumidoresId(consumidoresId: number): Promise<boolean> {
    const result = await this.repo.delete(consumidoresId);

    if (result.affected === 0) {
      throw new Error(`Consumidor com ID ${consumidoresId} não encontrado.`);
    }

    return true;
  }

  // ==========================================================
  // BUSCA POR ID
  // ==========================================================
  async findOneConsumidoresById(
    consumidoresId: number
  ): Promise<ConsumidoresEntity | null> {
    return this.repo.findOne({
      where: { id: consumidoresId },
      relations: {
        pessoas: true,
        empresas: true
      }
    });
  }

  // ==========================================================
  // LISTA TODOS
  // ==========================================================
  async findConsumidoresAll(
    where?: FindOptionsWhere<ConsumidoresEntity> | FindOptionsWhere<ConsumidoresEntity>[],
    orderBy: FindOptionsOrder<ConsumidoresEntity> = { id: 'ASC' }
  ): Promise<ConsumidoresEntity[]> {
    return this.repo.find({
      where,
      relations: {
        pessoas: true,
        empresas: true
      },
      order: orderBy
    });
  }

  // ==========================================================
  // BUSCA EXATA POR NOME
  // ==========================================================
  async findOneConsumidoresByNome(
    nome: string
  ): Promise<ConsumidoresEntity | null> {
    return this.repo.findOne({
      where: { nome },
      relations: {
        pessoas: true,
        empresas: true
      }
    });
  }

  // ==========================================================
  // BUSCA TODOS POR NOME EXATO
  // ==========================================================
  async findAllConsumidoresByNome(nome: string): Promise<ConsumidoresEntity[]> {
    return this.repo.find({
      where: { nome },
      relations: {
        pessoas: true,
        empresas: true
      },
      order: { id: 'ASC' }
    });
  }

  // ==========================================================
  // BUSCA EXATA POR FANTASY
  // ==========================================================
  async findOneConsumidoresByFantasy(
    fantasy: string
  ): Promise<ConsumidoresEntity | null> {
    return this.repo.findOne({
      where: { fantasy },
      relations: {
        pessoas: true,
        empresas: true
      }
    });
  }

  // ==========================================================
  // BUSCA TODOS POR FANTASY EXATO
  // ==========================================================
  async findAllConsumidoresByFantasy(
    fantasy: string
  ): Promise<ConsumidoresEntity[]> {
    return this.repo.find({
      where: { fantasy },
      relations: {
        pessoas: true,
        empresas: true
      },
      order: { id: 'ASC' }
    });
  }

  // ==========================================================
  // BUSCA PARCIAL POR NOME
  // ==========================================================
  async searchNameParcialConsumidores(
    txt?: string
  ): Promise<ConsumidoresEntity[]> {
    const query = this.repo
      .createQueryBuilder('consumidores')
      .leftJoinAndSelect('consumidores.pessoas', 'pessoas')
      .leftJoinAndSelect('consumidores.empresas', 'empresas')
      .orderBy('consumidores.nome', 'ASC');

    if (txt && txt.trim() !== '') {
      query.andWhere(
        'consumidores.nome LIKE :txt COLLATE utf8mb4_general_ci',
        { txt: `%${txt}%` }
      );
    }

    return query.getMany();
  }

  // ==========================================================
  // BUSCA PARCIAL POR FANTASY
  // ==========================================================
  async searchFantasyParcialConsumidores(
    txt?: string
  ): Promise<ConsumidoresEntity[]> {
    const query = this.repo
      .createQueryBuilder('consumidores')
      .leftJoinAndSelect('consumidores.pessoas', 'pessoas')
      .leftJoinAndSelect('consumidores.empresas', 'empresas')
      .orderBy('consumidores.fantasy', 'ASC');

    if (txt && txt.trim() !== '') {
      query.andWhere(
        'consumidores.fantasy LIKE :txt COLLATE utf8mb4_general_ci',
        { txt: `%${txt}%` }
      );
    }

    return query.getMany();
  }

  // ==========================================================
  // PESQUISA GERAL
  // ==========================================================
  async searchConsumidores(params: {
    id?: number;
    nome?: string;
    fantasy?: string;
    id_pessoas?: number;
    id_empresas?: number;
  }): Promise<ConsumidoresEntity[]> {
    const query = this.repo
      .createQueryBuilder('consumidores')
      .leftJoinAndSelect('consumidores.pessoas', 'pessoas')
      .leftJoinAndSelect('consumidores.empresas', 'empresas')
      .orderBy('consumidores.id', 'ASC');

    if (params.id) {
      query.andWhere('consumidores.id = :id', { id: params.id });
    }

    if (params.nome) {
      query.andWhere(
        'consumidores.nome LIKE :nome COLLATE utf8mb4_general_ci',
        { nome: `%${params.nome}%` }
      );
    }

    if (params.fantasy) {
      query.andWhere(
        'consumidores.fantasy LIKE :fantasy COLLATE utf8mb4_general_ci',
        { fantasy: `%${params.fantasy}%` }
      );
    }

    if (typeof params.id_pessoas === 'number') {
      query.andWhere('consumidores.id_pessoas = :id_pessoas', {
        id_pessoas: params.id_pessoas
      });
    }

    if (typeof params.id_empresas === 'number') {
      query.andWhere('consumidores.id_empresas = :id_empresas', {
        id_empresas: params.id_empresas
      });
    }

    return query.getMany();
  }

  // ==========================================================
  // LISTA POR ID_PESSOAS
  // ==========================================================
  async findAllConsumidoresByPessoasId(
    pessoasId: number
  ): Promise<ConsumidoresEntity[]> {
    return this.repo.find({
      where: { id_pessoas: pessoasId },
      relations: {
        pessoas: true,
        empresas: true
      },
      order: { id: 'ASC' }
    });
  }

  // ==========================================================
  // LISTA POR ID_EMPRESAS
  // ==========================================================
  async findAllConsumidoresByEmpresasId(
    empresasId: number
  ): Promise<ConsumidoresEntity[]> {
    return this.repo.find({
      where: { id_empresas: empresasId },
      relations: {
        pessoas: true,
        empresas: true
      },
      order: { id: 'ASC' }
    });
  }

  // ==========================================================
  // LISTA DETALHADA
  // ==========================================================
  async listAllConsumidoresDetails(): Promise<ConsumidoresEntity[]> {
    return this.repo
      .createQueryBuilder('consumidores')
      .leftJoinAndSelect('consumidores.pessoas', 'pessoas')
      .leftJoinAndSelect('consumidores.empresas', 'empresas')
      .orderBy('consumidores.id', 'ASC')
      .getMany();
  }

  // ============================================================
  // UTIL
  // ============================================================
  private validateId(id: number): void {
    if (!id || isNaN(id) || id <= 0) {
      throw new Error('Invalid consumidoresId');
    }
  }
}




