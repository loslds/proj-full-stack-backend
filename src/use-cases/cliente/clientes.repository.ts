
//C:\repository\proj-full-stack-backend\src\use-cases\cliente\clientes.reposytory.ts
import {
  DataSource,
  DeepPartial,
  FindOptionsWhere,
  FindOptionsOrder,
  Repository
} from 'typeorm';

import { ClientesEntity } from './clientes.entity';
import type { ClientesCreate } from './clientes.dto';

export class ClientesRepository {
  private repo: Repository<ClientesEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(ClientesEntity);
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
  ): Promise<ClientesEntity | null> {
    const query = this.repo.createQueryBuilder('clientes');

    if (nome) {
      query.andWhere('clientes.nome = :nome', { nome });
    }

    if (fantasy) {
      query.andWhere('clientes.fantasy = :fantasy', { fantasy });
    }

    if (typeof id_pessoas === 'number') {
      query.andWhere('clientes.id_pessoas = :id_pessoas', { id_pessoas });
    }

    if (typeof id_empresas === 'number') {
      query.andWhere('clientes.id_empresas = :id_empresas', { id_empresas });
    }

    if (excludes.length > 0) {
      query.andWhere('clientes.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }

  // ==========================================================
  // CREATE
  // ==========================================================
  async createClientes(
    clientes: ClientesCreate
  ): Promise<ClientesEntity> {
    const duplicated = await this.hasDuplicated(
      clientes.nome,
      clientes.fantasy,
      clientes.id_pessoas,
      clientes.id_empresas
    );

    if (duplicated) {
      throw new Error(
        'Cliente duplicado! Nome, fantasy, pessoa e empresa já existentes.'
      );
    }

    const data = this.repo.create({
      ...clientes,
      id_pessoas: clientes.id_pessoas ?? 0,
      id_empresas: clientes.id_empresas ?? 0,
      createdBy: clientes.createdBy ?? 0,
      updatedBy: clientes.updatedBy ?? 0
    });

    return this.repo.save(data);
  }

  // ==========================================================
  // UPDATE
  // ==========================================================
  async updateClientesId(
    clientesId: number,
    clientes: DeepPartial<ClientesEntity>
  ): Promise<ClientesEntity> {
    const current = await this.repo.findOne({
      where: { id: clientesId }
    });

    if (!current) {
      throw new Error(`Cliente com ID ${clientesId} não encontrado.`);
    }

    const duplicated = await this.hasDuplicated(
      clientes.nome ?? current.nome,
      clientes.fantasy ?? current.fantasy,
      clientes.id_pessoas ?? current.id_pessoas,
      clientes.id_empresas ?? current.id_empresas,
      [clientesId]
    );

    if (duplicated) {
      throw new Error(
        'Cliente duplicado! Nome, fantasy, pessoa e empresa já existentes.'
      );
    }

    const data = this.repo.create({
      ...current,
      ...clientes,
      id: clientesId
    });

    return this.repo.save(data);
  }

  // ==========================================================
  // DELETE
  // ==========================================================
  async deleteClientesId(clientesId: number): Promise<boolean> {
    const result = await this.repo.delete(clientesId);

    if (result.affected === 0) {
      throw new Error(`Cliente com ID ${clientesId} não encontrado.`);
    }

    return true;
  }

  // ==========================================================
  // BUSCA POR ID
  // ==========================================================
  async findOneClientesById(
    clientesId: number
  ): Promise<ClientesEntity | null> {
    return this.repo.findOne({
      where: { id: clientesId },
      relations: {
        pessoas: true,
        empresas: true
      }
    });
  }

  // ==========================================================
  // LISTA TODOS
  // ==========================================================
  async findClientesAll(
    where?: FindOptionsWhere<ClientesEntity> | FindOptionsWhere<ClientesEntity>[],
    orderBy: FindOptionsOrder<ClientesEntity> = { id: 'ASC' }
  ): Promise<ClientesEntity[]> {
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
  async findOneClientesByNome(
    nome: string
  ): Promise<ClientesEntity | null> {
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
  async findAllClientesByNome(nome: string): Promise<ClientesEntity[]> {
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
  async findOneClientesByFantasy(
    fantasy: string
  ): Promise<ClientesEntity | null> {
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
  async findAllClientesByFantasy(
    fantasy: string
  ): Promise<ClientesEntity[]> {
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
  async searchNameParcialClientes(
    txt?: string
  ): Promise<ClientesEntity[]> {
    const query = this.repo
      .createQueryBuilder('clientes')
      .leftJoinAndSelect('clientes.pessoas', 'pessoas')
      .leftJoinAndSelect('clientes.empresas', 'empresas')
      .orderBy('clientes.nome', 'ASC');

    if (txt && txt.trim() !== '') {
      query.andWhere(
        'clientes.nome LIKE :txt COLLATE utf8mb4_general_ci',
        { txt: `%${txt}%` }
      );
    }

    return query.getMany();
  }

  // ==========================================================
  // BUSCA PARCIAL POR FANTASY
  // ==========================================================
  async searchFantasyParcialClientes(
    txt?: string
  ): Promise<ClientesEntity[]> {
    const query = this.repo
      .createQueryBuilder('clientes')
      .leftJoinAndSelect('clientes.pessoas', 'pessoas')
      .leftJoinAndSelect('clientes.empresas', 'empresas')
      .orderBy('clientes.fantasy', 'ASC');

    if (txt && txt.trim() !== '') {
      query.andWhere(
        'clientes.fantasy LIKE :txt COLLATE utf8mb4_general_ci',
        { txt: `%${txt}%` }
      );
    }

    return query.getMany();
  }

  // ==========================================================
  // PESQUISA GERAL
  // ==========================================================
  async searchClientes(params: {
    id?: number;
    nome?: string;
    fantasy?: string;
    id_pessoas?: number;
    id_empresas?: number;
  }): Promise<ClientesEntity[]> {
    const query = this.repo
      .createQueryBuilder('clientes')
      .leftJoinAndSelect('clientes.pessoas', 'pessoas')
      .leftJoinAndSelect('clientes.empresas', 'empresas')
      .orderBy('clientes.id', 'ASC');

    if (params.id) {
      query.andWhere('clientes.id = :id', { id: params.id });
    }

    if (params.nome) {
      query.andWhere(
        'clientes.nome LIKE :nome COLLATE utf8mb4_general_ci',
        { nome: `%${params.nome}%` }
      );
    }

    if (params.fantasy) {
      query.andWhere(
        'clientes.fantasy LIKE :fantasy COLLATE utf8mb4_general_ci',
        { fantasy: `%${params.fantasy}%` }
      );
    }

    if (typeof params.id_pessoas === 'number') {
      query.andWhere('clientes.id_pessoas = :id_pessoas', {
        id_pessoas: params.id_pessoas
      });
    }

    if (typeof params.id_empresas === 'number') {
      query.andWhere('clientes.id_empresas = :id_empresas', {
        id_empresas: params.id_empresas
      });
    }

    return query.getMany();
  }

  // ==========================================================
  // LISTA POR ID_PESSOAS
  // ==========================================================
  async findAllClientesByPessoasId(
    pessoasId: number
  ): Promise<ClientesEntity[]> {
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
  async findAllClientesByEmpresasId(
    empresasId: number
  ): Promise<ClientesEntity[]> {
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
  async listAllClientesDetails(): Promise<ClientesEntity[]> {
    return this.repo
      .createQueryBuilder('clientes')
      .leftJoinAndSelect('clientes.pessoas', 'pessoas')
      .leftJoinAndSelect('clientes.empresas', 'empresas')
      .orderBy('clientes.id', 'ASC')
      .getMany();
  }

  // ============================================================
  // UTIL
  // ============================================================
  private validateId(id: number): void {
    if (!id || isNaN(id) || id <= 0) {
      throw new Error('Invalid clientesId');
    }
  }
}





