
// C:\repository\proj-full-stack-backend\src\use-cases\acesso\acessos.repository.ts

import {
  DataSource,
  DeepPartial,
  FindOptionsWhere,
  FindOptionsOrder,
  Repository
} from 'typeorm';

import { AcessosEntity } from './acessos.entity';
import type { AcessosCreate } from './acessos.dto';

export class AcessosRepository {
  private repo: Repository<AcessosEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(AcessosEntity);
  }

  // ============================================================
  // * DUPLICIDADE *
  // ============================================================
  async hasDuplicatedAcessos(
    id_users?: number,
    excludes: number[] = []
  ): Promise<AcessosEntity | null> {
    const query = this.repo.createQueryBuilder('acessos');

    if (typeof id_users === 'number') {
      query.andWhere('acessos.id_users = :id_users', { id_users });
    }

    if (excludes.length > 0) {
      query.andWhere('acessos.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }

  // ============================================================
  // * CRUD *
  // ============================================================
  async findAcessosAll(
    where?: FindOptionsWhere<AcessosEntity> | FindOptionsWhere<AcessosEntity>[],
    orderBy: FindOptionsOrder<AcessosEntity> = { id: 'ASC' }
  ): Promise<AcessosEntity[]> {
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

  async createAcessos(acessos: AcessosCreate): Promise<AcessosEntity> {
    const duplicated = await this.hasDuplicatedAcessos(
      acessos.id_users ?? 0
    );

    if (duplicated) {
      throw new Error(
        'Acesso duplicado! Já existe acesso vinculado ao usuário informado.'
      );
    }

    const data = this.repo.create({
      ...acessos,
      id_users: acessos.id_users ?? 0,
      permissoes: acessos.permissoes ?? [],
      createdBy: acessos.createdBy ?? 0,
      updatedBy: acessos.updatedBy ?? 0
    });

    return this.repo.save(data);
  }

  async findOneAcessosById(
    acessosId: number
  ): Promise<AcessosEntity | null> {
    this.validateId(acessosId);

    return this.repo.findOne({
      where: { id: acessosId },
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

  async updateAcessosId(
    acessosId: number,
    acessos: DeepPartial<AcessosEntity>
  ): Promise<AcessosEntity> {
    this.validateId(acessosId);

    const current = await this.repo.findOne({
      where: { id: acessosId }
    });

    if (!current) {
      throw new Error(`Acesso com ID ${acessosId} não encontrado.`);
    }

    const duplicated = await this.hasDuplicatedAcessos(
      acessos.id_users ?? current.id_users,
      [acessosId]
    );

    if (duplicated) {
      throw new Error(
        'Acesso duplicado! Já existe acesso vinculado ao usuário informado.'
      );
    }

    const data = this.repo.create({
      ...current,
      ...acessos,
      id: acessosId
    });

    return this.repo.save(data);
  }

  async deleteAcessosId(acessosId: number): Promise<boolean> {
    this.validateId(acessosId);

    const result = await this.repo.delete(acessosId);

    if (result.affected === 0) {
      throw new Error(`Acesso com ID ${acessosId} não encontrado.`);
    }

    return true;
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================
  async searchAcessos(params: {
    id?: number;
    id_users?: number;
    createdBy?: number;
    updatedBy?: number;
  }): Promise<AcessosEntity[]> {
    const query = this.repo
      .createQueryBuilder('acessos')
      .leftJoinAndSelect('acessos.users', 'users')
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
      .orderBy('acessos.id', 'ASC');

    if (typeof params.id === 'number') {
      query.andWhere('acessos.id = :id', { id: params.id });
    }

    if (typeof params.id_users === 'number') {
      query.andWhere('acessos.id_users = :id_users', {
        id_users: params.id_users
      });
    }

    if (typeof params.createdBy === 'number') {
      query.andWhere('acessos.createdBy = :createdBy', {
        createdBy: params.createdBy
      });
    }

    if (typeof params.updatedBy === 'number') {
      query.andWhere('acessos.updatedBy = :updatedBy', {
        updatedBy: params.updatedBy
      });
    }

    return query.getMany();
  }

  async findAllAcessosByUsersId(
    usersId: number
  ): Promise<AcessosEntity[]> {
    return this.repo.find({
      where: { id_users: usersId },
      relations: {
        users: true
      },
      order: { id: 'ASC' }
    });
  }

  async listAllAcessosDetails(): Promise<AcessosEntity[]> {
    return this.repo
      .createQueryBuilder('acessos')
      .leftJoinAndSelect('acessos.users', 'users')
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
      .orderBy('acessos.id', 'ASC')
      .getMany();
  }

  // ============================================================
  // * UTIL *
  // ============================================================
  private validateId(id: number): void {
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      throw new Error('Invalid acessosId');
    }
  }
}