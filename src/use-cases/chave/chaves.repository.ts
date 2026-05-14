
// C:\repository\proj-full-stack-backend\src\use-cases\chave\chaves.repository.ts

import {
  DataSource,
  DeepPartial,
  FindOptionsWhere,
  FindOptionsOrder,
  Repository
} from 'typeorm';

import { ChavesEntity } from './chaves.entity';
import type { ChavesCreate } from './chaves.dto';

export class ChavesRepository {
  private repo: Repository<ChavesEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(ChavesEntity);
  }

  // ============================================================
  // * DUPLICIDADE *
  // ============================================================
  async hasDuplicatedChaves(
    identificador?: string,
    id_users?: number,
    excludes: number[] = []
  ): Promise<ChavesEntity | null> {
    const query = this.repo.createQueryBuilder('chaves');

    if (identificador) {
      query.andWhere(
        'chaves.identificador = :identificador COLLATE utf8mb4_general_ci',
        { identificador }
      );
    }

    if (typeof id_users === 'number') {
      query.andWhere('chaves.id_users = :id_users', { id_users });
    }

    if (excludes.length > 0) {
      query.andWhere('chaves.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }

  // ============================================================
  // * CRUD *
  // ============================================================
  async findChavesAll(
    where?: FindOptionsWhere<ChavesEntity> | FindOptionsWhere<ChavesEntity>[],
    orderBy: FindOptionsOrder<ChavesEntity> = { id: 'ASC' }
  ): Promise<ChavesEntity[]> {
    return this.repo.find({
      where,
      relations: {
        users: {
          cadastros: {
            empresas: true,
            visitantes: true,
            consumidores: true,
            clientes: true,
            fornecedores: true,
            funcionarios: true,
            cidades: {
              estados: true
            },
            imagens: true
          }
        }
      },
      order: orderBy
    });
  }

  async createChaves(chaves: ChavesCreate): Promise<ChavesEntity> {
    const duplicated = await this.hasDuplicatedChaves(
      chaves.identificador,
      chaves.id_users ?? 0
    );

    if (duplicated) {
      throw new Error(
        'Chave duplicada! Identificador e usuário já existentes.'
      );
    }

    const data = this.repo.create({
      ...chaves,
      id_users: chaves.id_users ?? 0,
      ativo: chaves.ativo ?? 1,
      createdBy: chaves.createdBy ?? 0,
      updatedBy: chaves.updatedBy ?? 0
    });

    return this.repo.save(data);
  }

  async findOneChavesById(chavesId: number): Promise<ChavesEntity | null> {
    this.validateId(chavesId);

    return this.repo.findOne({
      where: { id: chavesId },
      relations: {
        users: {
          cadastros: {
            empresas: true,
            visitantes: true,
            consumidores: true,
            clientes: true,
            fornecedores: true,
            funcionarios: true,
            cidades: {
              estados: true
            },
            imagens: true
          }
        }
      }
    });
  }

  async updateChavesId(
    chavesId: number,
    chaves: DeepPartial<ChavesEntity>
  ): Promise<ChavesEntity> {
    this.validateId(chavesId);

    const current = await this.repo.findOne({
      where: { id: chavesId }
    });

    if (!current) {
      throw new Error(`Chave com ID ${chavesId} não encontrada.`);
    }

    const duplicated = await this.hasDuplicatedChaves(
      chaves.identificador ?? current.identificador,
      chaves.id_users ?? current.id_users,
      [chavesId]
    );

    if (duplicated) {
      throw new Error(
        'Chave duplicada! Identificador e usuário já existentes.'
      );
    }

    const data = this.repo.create({
      ...current,
      ...chaves,
      id: chavesId
    });

    return this.repo.save(data);
  }

  async deleteChavesId(chavesId: number): Promise<boolean> {
    this.validateId(chavesId);

    const current = await this.repo.findOne({
      where: { id: chavesId }
    });

    if (!current) {
      throw new Error(`Chave com ID ${chavesId} não encontrada.`);
    }

    current.ativo = 0;

    await this.repo.save(current);

    return true;
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================
  async searchChaves(params: {
    id?: number;
    id_users?: number;
    identificador?: string;
    ativo?: number;
    createdBy?: number;
    updatedBy?: number;
  }): Promise<ChavesEntity[]> {
    const query = this.repo
      .createQueryBuilder('chaves')
      .leftJoinAndSelect('chaves.users', 'users')
      .leftJoinAndSelect('users.cadastros', 'cadastros')
      .leftJoinAndSelect('cadastros.empresas', 'empresas')
      .leftJoinAndSelect('cadastros.visitantes', 'visitantes')
      .leftJoinAndSelect('cadastros.consumidores', 'consumidores')
      .leftJoinAndSelect('cadastros.clientes', 'clientes')
      .leftJoinAndSelect('cadastros.fornecedores', 'fornecedores')
      .leftJoinAndSelect('cadastros.funcionarios', 'funcionarios')
      .leftJoinAndSelect('cadastros.cidades', 'cidades')
      .leftJoinAndSelect('cidades.estados', 'estados')
      .leftJoinAndSelect('cadastros.imagens', 'imagens')
      .orderBy('chaves.id', 'ASC');

    if (typeof params.id === 'number') {
      query.andWhere('chaves.id = :id', { id: params.id });
    }

    if (typeof params.id_users === 'number') {
      query.andWhere('chaves.id_users = :id_users', {
        id_users: params.id_users
      });
    }

    if (params.identificador) {
      query.andWhere(
        'chaves.identificador LIKE :identificador COLLATE utf8mb4_general_ci',
        { identificador: `%${params.identificador}%` }
      );
    }

    if (typeof params.ativo === 'number') {
      query.andWhere('chaves.ativo = :ativo', {
        ativo: params.ativo
      });
    }

    if (typeof params.createdBy === 'number') {
      query.andWhere('chaves.createdBy = :createdBy', {
        createdBy: params.createdBy
      });
    }

    if (typeof params.updatedBy === 'number') {
      query.andWhere('chaves.updatedBy = :updatedBy', {
        updatedBy: params.updatedBy
      });
    }

    return query.getMany();
  }

  async searchIdentificadorParcialChaves(
    text?: string
  ): Promise<ChavesEntity[]> {
    const query = this.repo
      .createQueryBuilder('chaves')
      .leftJoinAndSelect('chaves.users', 'users')
      .orderBy('chaves.id', 'ASC');

    if (text && text.trim() !== '') {
      query.andWhere(
        'chaves.identificador LIKE :text COLLATE utf8mb4_general_ci',
        { text: `%${text}%` }
      );
    }

    return query.getMany();
  }

  async findAllChavesByUsersId(usersId: number): Promise<ChavesEntity[]> {
    return this.repo.find({
      where: { id_users: usersId },
      relations: {
        users: true
      },
      order: { id: 'ASC' }
    });
  }

  async findChavesAllActived(ativo?: number): Promise<ChavesEntity[]> {
    const query = this.repo
      .createQueryBuilder('chaves')
      .leftJoinAndSelect('chaves.users', 'users')
      .orderBy('chaves.id', 'ASC');

    if (typeof ativo === 'number') {
      query.andWhere('chaves.ativo = :ativo', { ativo });
    }

    return query.getMany();
  }

  async listAllChavesDetails(): Promise<ChavesEntity[]> {
    return this.repo
      .createQueryBuilder('chaves')
      .leftJoinAndSelect('chaves.users', 'users')
      .leftJoinAndSelect('users.cadastros', 'cadastros')
      .leftJoinAndSelect('cadastros.empresas', 'empresas')
      .leftJoinAndSelect('cadastros.visitantes', 'visitantes')
      .leftJoinAndSelect('cadastros.consumidores', 'consumidores')
      .leftJoinAndSelect('cadastros.clientes', 'clientes')
      .leftJoinAndSelect('cadastros.fornecedores', 'fornecedores')
      .leftJoinAndSelect('cadastros.funcionarios', 'funcionarios')
      .leftJoinAndSelect('cadastros.cidades', 'cidades')
      .leftJoinAndSelect('cidades.estados', 'estados')
      .leftJoinAndSelect('cadastros.imagens', 'imagens')
      .orderBy('chaves.id', 'ASC')
      .getMany();
  }

  // ============================================================
  // * UTIL *
  // ============================================================
  private validateId(id: number): void {
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      throw new Error('Invalid chavesId');
    }
  }
}

