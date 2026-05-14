// C:\repository\proj-full-stack-backend\src\use-cases\user\users.repository.ts

import {
  DataSource,
  DeepPartial,
  FindOptionsWhere,
  FindOptionsOrder,
  Repository
} from 'typeorm';

import { UsersEntity } from './users.entity';
import type { UsersCreate } from './users.dto';

export class UsersRepository {
  private repo: Repository<UsersEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(UsersEntity);
  }

  // ============================================================
  // * DUPLICIDADE *
  // ============================================================
  async hasDuplicatedUsers(
    id_cadastros?: number,
    excludes: number[] = []
  ): Promise<UsersEntity | null> {
    const query = this.repo.createQueryBuilder('users');

    if (typeof id_cadastros === 'number') {
      query.andWhere('users.id_cadastros = :id_cadastros', {
        id_cadastros
      });
    }

    if (excludes.length > 0) {
      query.andWhere('users.id NOT IN (:...excludes)', {
        excludes
      });
    }

    return query.getOne();
  }

  // ============================================================
  // * CRUD *
  // ============================================================
  async findUsersAll(
    where?: FindOptionsWhere<UsersEntity> | FindOptionsWhere<UsersEntity>[],
    orderBy: FindOptionsOrder<UsersEntity> = { id: 'ASC' }
  ): Promise<UsersEntity[]> {
    return this.repo.find({
      where,
      relations: {
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
      },
      order: orderBy
    });
  }

  async createUsers(users: UsersCreate): Promise<UsersEntity> {
    const duplicated = await this.hasDuplicatedUsers(
      users.id_cadastros ?? 0
    );

    if (duplicated) {
      throw new Error(
        'User duplicado! Já existe usuário vinculado ao cadastro informado.'
      );
    }

    const data = this.repo.create({
      ...users,
      id_cadastros: users.id_cadastros ?? 0,
      is_actived: users.is_actived ?? 0,
      createdBy: users.createdBy ?? 0,
      updatedBy: users.updatedBy ?? 0
    });

    return this.repo.save(data);
  }

  async findOneUsersById(usersId: number): Promise<UsersEntity | null> {
    this.validateId(usersId);

    return this.repo.findOne({
      where: { id: usersId },
      relations: {
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
    });
  }

  async updateUsersId(
    usersId: number,
    users: DeepPartial<UsersEntity>
  ): Promise<UsersEntity> {
    this.validateId(usersId);

    const current = await this.repo.findOne({
      where: { id: usersId }
    });

    if (!current) {
      throw new Error(`User com ID ${usersId} não encontrado.`);
    }

    const duplicated = await this.hasDuplicatedUsers(
      users.id_cadastros ?? current.id_cadastros,
      [usersId]
    );

    if (duplicated) {
      throw new Error(
        'User duplicado! Já existe usuário vinculado ao cadastro informado.'
      );
    }

    const data = this.repo.create({
      ...current,
      ...users,
      id: usersId
    });

    return this.repo.save(data);
  }

  async deleteUsersId(usersId: number): Promise<boolean> {
    this.validateId(usersId);

    const current = await this.repo.findOne({
      where: { id: usersId }
    });

    if (!current) {
      throw new Error(`User com ID ${usersId} não encontrado.`);
    }

    current.is_actived = 0;

    await this.repo.save(current);

    return true;
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================
  async searchUsers(params: {
    id?: number;
    id_cadastros?: number;
    is_actived?: number;
    createdBy?: number;
    updatedBy?: number;
  }): Promise<UsersEntity[]> {
    const query = this.repo
      .createQueryBuilder('users')
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
      .orderBy('users.id', 'ASC');

    if (typeof params.id === 'number') {
      query.andWhere('users.id = :id', { id: params.id });
    }

    if (typeof params.id_cadastros === 'number') {
      query.andWhere('users.id_cadastros = :id_cadastros', {
        id_cadastros: params.id_cadastros
      });
    }

    if (typeof params.is_actived === 'number') {
      query.andWhere('users.is_actived = :is_actived', {
        is_actived: params.is_actived
      });
    }

    if (typeof params.createdBy === 'number') {
      query.andWhere('users.createdBy = :createdBy', {
        createdBy: params.createdBy
      });
    }

    if (typeof params.updatedBy === 'number') {
      query.andWhere('users.updatedBy = :updatedBy', {
        updatedBy: params.updatedBy
      });
    }

    return query.getMany();
  }

  async findUsersAllActived(is_actived?: number): Promise<UsersEntity[]> {
    const query = this.repo
      .createQueryBuilder('users')
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
      .orderBy('users.id', 'ASC')
      .addOrderBy('funcionarios.nome', 'ASC')
      .addOrderBy('clientes.nome', 'ASC')
      .addOrderBy('fornecedores.nome', 'ASC')
      .addOrderBy('consumidores.nome', 'ASC')
      .addOrderBy('visitantes.nome', 'ASC')
      .addOrderBy('empresas.nome', 'ASC');

    if (typeof is_actived === 'number') {
      query.andWhere('users.is_actived = :is_actived', {
        is_actived
      });
    }

    return query.getMany();
  }

  async findAllUsersByCadastrosId(
    cadastrosId: number
  ): Promise<UsersEntity[]> {
    return this.repo.find({
      where: { id_cadastros: cadastrosId },
      relations: {
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
      },
      order: { id: 'ASC' }
    });
  }

  async listAllUsersDetails(): Promise<UsersEntity[]> {
    return this.repo
      .createQueryBuilder('users')
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
      .orderBy('users.id', 'ASC')
      .addOrderBy('funcionarios.nome', 'ASC')
      .addOrderBy('clientes.nome', 'ASC')
      .addOrderBy('fornecedores.nome', 'ASC')
      .addOrderBy('consumidores.nome', 'ASC')
      .addOrderBy('visitantes.nome', 'ASC')
      .addOrderBy('empresas.nome', 'ASC')
      .getMany();
  }

  // ============================================================
  // * UTIL *
  // ============================================================
  private validateId(id: number): void {
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      throw new Error('Invalid usersId');
    }
  }
}

