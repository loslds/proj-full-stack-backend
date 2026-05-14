
// C:\repository\proj-full-stack-backend\src\use-cases\login\logins.repository.ts

import {
  DataSource,
  DeepPartial,
  FindOptionsWhere,
  FindOptionsOrder,
  Repository
} from 'typeorm';

import { LoginsEntity } from './logins.entity';
import type { LoginsCreate } from './logins.dto';

export class LoginsRepository {
  private repo: Repository<LoginsEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(LoginsEntity);
  }

  // ============================================================
  // * DUPLICIDADE *
  // ============================================================
  async hasDuplicatedLogins(
    id_users?: number,
    excludes: number[] = []
  ): Promise<LoginsEntity | null> {
    const query = this.repo.createQueryBuilder('logins');

    if (typeof id_users === 'number') {
      query.andWhere('logins.id_users = :id_users', { id_users });
      query.andWhere('logins.dt_logout IS NULL');
    }

    if (excludes.length > 0) {
      query.andWhere('logins.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }

  // ============================================================
  // * CRUD *
  // ============================================================
  async findLoginsAll(
    where?: FindOptionsWhere<LoginsEntity> | FindOptionsWhere<LoginsEntity>[],
    orderBy: FindOptionsOrder<LoginsEntity> = { id: 'ASC' }
  ): Promise<LoginsEntity[]> {
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

  async createLogins(logins: LoginsCreate): Promise<LoginsEntity> {
    const duplicated = await this.hasDuplicatedLogins(logins.id_users ?? 0);

    if (duplicated) {
      throw new Error(
        'Login duplicado! Já existe sessão aberta para o usuário informado.'
      );
    }

    const data = this.repo.create({
      ...logins,
      id_users: logins.id_users ?? 0,
      dt_login: logins.dt_login ?? new Date(),
      dt_logout: logins.dt_logout ?? null,
      tt_minutos: logins.tt_minutos ?? 0,
      createdBy: logins.createdBy ?? 0,
      updatedBy: logins.updatedBy ?? 0
    });

    return this.repo.save(data);
  }

  async findOneLoginsById(loginsId: number): Promise<LoginsEntity | null> {
    this.validateId(loginsId);

    return this.repo.findOne({
      where: { id: loginsId },
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

  async updateLoginsId(
    loginsId: number,
    logins: DeepPartial<LoginsEntity>
  ): Promise<LoginsEntity> {
    this.validateId(loginsId);

    const current = await this.repo.findOne({
      where: { id: loginsId }
    });

    if (!current) {
      throw new Error(`Login com ID ${loginsId} não encontrado.`);
    }

    const duplicated = await this.hasDuplicatedLogins(
      logins.id_users ?? current.id_users,
      [loginsId]
    );

    if (duplicated) {
      throw new Error(
        'Login duplicado! Já existe sessão aberta para o usuário informado.'
      );
    }

    const data = this.repo.create({
      ...current,
      ...logins,
      id: loginsId
    });

    return this.repo.save(data);
  }

  async deleteLoginsId(loginsId: number): Promise<boolean> {
    this.validateId(loginsId);

    const current = await this.repo.findOne({
      where: { id: loginsId }
    });

    if (!current) {
      throw new Error(`Login com ID ${loginsId} não encontrado.`);
    }

    current.dt_logout = current.dt_logout ?? new Date();

    if (current.dt_login && current.dt_logout) {
      current.tt_minutos = Math.max(
        0,
        Math.floor(
          (current.dt_logout.getTime() - current.dt_login.getTime()) / 60000
        )
      );
    }

    await this.repo.save(current);

    return true;
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================
  async searchLogins(params: {
    id?: number;
    id_users?: number;
    tt_minutos?: number;
    createdBy?: number;
    updatedBy?: number;
  }): Promise<LoginsEntity[]> {
    const query = this.repo
      .createQueryBuilder('logins')
      .leftJoinAndSelect('logins.users', 'users')
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
      .orderBy('logins.id', 'ASC');

    if (typeof params.id === 'number') {
      query.andWhere('logins.id = :id', { id: params.id });
    }

    if (typeof params.id_users === 'number') {
      query.andWhere('logins.id_users = :id_users', {
        id_users: params.id_users
      });
    }

    if (typeof params.tt_minutos === 'number') {
      query.andWhere('logins.tt_minutos = :tt_minutos', {
        tt_minutos: params.tt_minutos
      });
    }

    if (typeof params.createdBy === 'number') {
      query.andWhere('logins.createdBy = :createdBy', {
        createdBy: params.createdBy
      });
    }

    if (typeof params.updatedBy === 'number') {
      query.andWhere('logins.updatedBy = :updatedBy', {
        updatedBy: params.updatedBy
      });
    }

    return query.getMany();
  }

  async findAllLoginsByUsersId(usersId: number): Promise<LoginsEntity[]> {
    return this.repo.find({
      where: { id_users: usersId },
      relations: {
        users: true
      },
      order: { id: 'ASC' }
    });
  }

  async listAllLoginsDetails(): Promise<LoginsEntity[]> {
    return this.repo
      .createQueryBuilder('logins')
      .leftJoinAndSelect('logins.users', 'users')
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
      .orderBy('logins.id', 'ASC')
      .getMany();
  }

  // ============================================================
  // * UTIL *
  // ============================================================
  private validateId(id: number): void {
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      throw new Error('Invalid loginsId');
    }
  }
}
