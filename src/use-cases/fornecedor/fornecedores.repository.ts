
//C:\repository\proj-full-stack-backend\src\use-cases\fornecedor\fornecedores.reposytory.ts
import {
  DataSource,
  DeepPartial,
  FindOptionsWhere,
  FindOptionsOrder,
  Repository
} from 'typeorm';

import { FornecedoresEntity } from './fornecedores.entity';
import type { FornecedoresCreate } from './fornecedores.dto';

export class FornecedoresRepository {
  private repo: Repository<FornecedoresEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(FornecedoresEntity);
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
  ): Promise<FornecedoresEntity | null> {
    const query = this.repo.createQueryBuilder('fornecedores');

    if (nome) {
      query.andWhere('fornecedores.nome = :nome', { nome });
    }

    if (fantasy) {
      query.andWhere('fornecedores.fantasy = :fantasy', { fantasy });
    }

    if (typeof id_pessoas === 'number') {
      query.andWhere('fornecedores.id_pessoas = :id_pessoas', { id_pessoas });
    }

    if (typeof id_empresas === 'number') {
      query.andWhere('fornecedores.id_empresas = :id_empresas', { id_empresas });
    }

    if (excludes.length > 0) {
      query.andWhere('fornecedores.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }

  // ==========================================================
  // CREATE
  // ==========================================================
  async createFornecedores(
    fornecedores: FornecedoresCreate
  ): Promise<FornecedoresEntity> {
    const duplicated = await this.hasDuplicated(
      fornecedores.nome,
      fornecedores.fantasy,
      fornecedores.id_pessoas,
      fornecedores.id_empresas
    );

    if (duplicated) {
      throw new Error(
        'Fornecedor duplicado! Nome, fantasy, pessoa e empresa já existentes.'
      );
    }

    const data = this.repo.create({
      ...fornecedores,
      id_pessoas: fornecedores.id_pessoas ?? 0,
      id_empresas: fornecedores.id_empresas ?? 0,
      createdBy: fornecedores.createdBy ?? 0,
      updatedBy: fornecedores.updatedBy ?? 0
    });

    return this.repo.save(data);
  }

  // ==========================================================
  // UPDATE
  // ==========================================================
  async updateFornecedoresId(
    fornecedoresId: number,
    fornecedores: DeepPartial<FornecedoresEntity>
  ): Promise<FornecedoresEntity> {
    const current = await this.repo.findOne({
      where: { id: fornecedoresId }
    });

    if (!current) {
      throw new Error(`Fornecedor com ID ${fornecedoresId} não encontrado.`);
    }

    const duplicated = await this.hasDuplicated(
      fornecedores.nome ?? current.nome,
      fornecedores.fantasy ?? current.fantasy,
      fornecedores.id_pessoas ?? current.id_pessoas,
      fornecedores.id_empresas ?? current.id_empresas,
      [fornecedoresId]
    );

    if (duplicated) {
      throw new Error(
        'Fornecedor duplicado! Nome, fantasy, pessoa e empresa já existentes.'
      );
    }

    const data = this.repo.create({
      ...current,
      ...fornecedores,
      id: fornecedoresId
    });

    return this.repo.save(data);
  }

  // ==========================================================
  // DELETE
  // ==========================================================
  async deleteFornecedoresId(fornecedoresId: number): Promise<boolean> {
    const result = await this.repo.delete(fornecedoresId);

    if (result.affected === 0) {
      throw new Error(`Fornecedor com ID ${fornecedoresId} não encontrado.`);
    }

    return true;
  }

  // ==========================================================
  // BUSCA POR ID
  // ==========================================================
  async findOneFornecedoresById(
    fornecedoresId: number
  ): Promise<FornecedoresEntity | null> {
    return this.repo.findOne({
      where: { id: fornecedoresId },
      relations: {
        pessoas: true,
        empresas: true
      }
    });
  }

  // ==========================================================
  // LISTA TODOS
  // ==========================================================
  async findFornecedoresAll(
    where?: FindOptionsWhere<FornecedoresEntity> | FindOptionsWhere<FornecedoresEntity>[],
    orderBy: FindOptionsOrder<FornecedoresEntity> = { id: 'ASC' }
  ): Promise<FornecedoresEntity[]> {
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
  async findOneFornecedoresByNome(
    nome: string
  ): Promise<FornecedoresEntity | null> {
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
  async findAllFornecedoresByNome(nome: string): Promise<FornecedoresEntity[]> {
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
  async findOneFornecedoresByFantasy(
    fantasy: string
  ): Promise<FornecedoresEntity | null> {
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
  async findAllFornecedoresByFantasy(
    fantasy: string
  ): Promise<FornecedoresEntity[]> {
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
  async searchNameParcialFornecedores(
    txt?: string
  ): Promise<FornecedoresEntity[]> {
    const query = this.repo
      .createQueryBuilder('fornecedores')
      .leftJoinAndSelect('fornecedores.pessoas', 'pessoas')
      .leftJoinAndSelect('fornecedores.empresas', 'empresas')
      .orderBy('fornecedores.nome', 'ASC');

    if (txt && txt.trim() !== '') {
      query.andWhere(
        'fornecedores.nome LIKE :txt COLLATE utf8mb4_general_ci',
        { txt: `%${txt}%` }
      );
    }

    return query.getMany();
  }

  // ==========================================================
  // BUSCA PARCIAL POR FANTASY
  // ==========================================================
  async searchFantasyParcialFornecedores(
    txt?: string
  ): Promise<FornecedoresEntity[]> {
    const query = this.repo
      .createQueryBuilder('fornecedores')
      .leftJoinAndSelect('fornecedores.pessoas', 'pessoas')
      .leftJoinAndSelect('fornecedores.empresas', 'empresas')
      .orderBy('fornecedores.fantasy', 'ASC');

    if (txt && txt.trim() !== '') {
      query.andWhere(
        'fornecedores.fantasy LIKE :txt COLLATE utf8mb4_general_ci',
        { txt: `%${txt}%` }
      );
    }

    return query.getMany();
  }

  // ==========================================================
  // PESQUISA GERAL
  // ==========================================================
  async searchFornecedores(params: {
    id?: number;
    nome?: string;
    fantasy?: string;
    id_pessoas?: number;
    id_empresas?: number;
  }): Promise<FornecedoresEntity[]> {
    const query = this.repo
      .createQueryBuilder('fornecedores')
      .leftJoinAndSelect('fornecedores.pessoas', 'pessoas')
      .leftJoinAndSelect('fornecedores.empresas', 'empresas')
      .orderBy('fornecedores.id', 'ASC');

    if (params.id) {
      query.andWhere('fornecedores.id = :id', { id: params.id });
    }

    if (params.nome) {
      query.andWhere(
        'fornecedores.nome LIKE :nome COLLATE utf8mb4_general_ci',
        { nome: `%${params.nome}%` }
      );
    }

    if (params.fantasy) {
      query.andWhere(
        'fornecedores.fantasy LIKE :fantasy COLLATE utf8mb4_general_ci',
        { fantasy: `%${params.fantasy}%` }
      );
    }

    if (typeof params.id_pessoas === 'number') {
      query.andWhere('fornecedores.id_pessoas = :id_pessoas', {
        id_pessoas: params.id_pessoas
      });
    }

    if (typeof params.id_empresas === 'number') {
      query.andWhere('fornecedores.id_empresas = :id_empresas', {
        id_empresas: params.id_empresas
      });
    }

    return query.getMany();
  }

  // ==========================================================
  // LISTA POR ID_PESSOAS
  // ==========================================================
  async findAllFornecedoresByPessoasId(
    pessoasId: number
  ): Promise<FornecedoresEntity[]> {
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
  async findAllFornecedoresByEmpresasId(
    empresasId: number
  ): Promise<FornecedoresEntity[]> {
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
  async listAllFornecedoresDetails(): Promise<FornecedoresEntity[]> {
    return this.repo
      .createQueryBuilder('fornecedores')
      .leftJoinAndSelect('fornecedores.pessoas', 'pessoas')
      .leftJoinAndSelect('fornecedores.empresas', 'empresas')
      .orderBy('fornecedores.id', 'ASC')
      .getMany();
  }

  // ============================================================
  // UTIL
  // ============================================================
  private validateId(id: number): void {
    if (!id || isNaN(id) || id <= 0) {
      throw new Error('Invalid fornecedoresId');
    }
  }
}



