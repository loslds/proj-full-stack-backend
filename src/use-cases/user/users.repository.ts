

// C:\repository\proj-full-stack-backend\src\use-cases\user\users.repository.ts
import {
  DataSource,
  DeepPartial,
  FindOptionsWhere,
  FindOptionsOrder,
  Repository
} from 'typeorm';

import { UsersEntity } from './users.entity';

export class UsersRepository {
  private repo: Repository<UsersEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(UsersEntity);
  }

  // ==========================================================
  // CREATE
  // ==========================================================
  async createUsers(users: DeepPartial<UsersEntity>): Promise<UsersEntity> {
    const data = this.repo.create(users);
    return this.repo.save(data);
  }

  // ==========================================================
  // UPDATE
  // ==========================================================
  async updateUsersId(
    usersId: number,
    users: DeepPartial<UsersEntity>
  ): Promise<UsersEntity> {
    const current = await this.repo.findOne({ where: { id: usersId } });

    if (!current) {
      throw new Error(`User ID ${usersId} não encontrado.`);
    }

    const data = this.repo.create({
      ...current,
      ...users,
      id: usersId
    });

    return this.repo.save(data);
  }

  // ==========================================================
  // DELETE
  // ==========================================================
  async deleteUsersId(usersId: number): Promise<boolean> {
    const result = await this.repo.delete(usersId);

    if (result.affected === 0) {
      throw new Error(`User ID ${usersId} não encontrado.`);
    }

    return true;
  }

  // ==========================================================
  // GET BY ID
  // ==========================================================
  async findOneUsersById(usersId: number): Promise<UsersEntity | null> {
    return this.repo.findOne({
      where: { id: usersId },
      relations: {
        cadastros: true
      }
    });
  }

  // ==========================================================
  // LIST ALL
  // ==========================================================
  async findUsersAll(
    where?: FindOptionsWhere<UsersEntity> | FindOptionsWhere<UsersEntity>[],
    orderBy: FindOptionsOrder<UsersEntity> = { id: 'ASC' }
  ): Promise<UsersEntity[]> {
    return this.repo.find({
      where,
      relations: {
        cadastros: true
      },
      order: orderBy
    });
  }

  async findUsersAllActived(is_actived?: boolean): Promise<UsersEntity[]> {
    const qb = this.repo
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.cadastros', 'cadastros');

    if (is_actived !== undefined) {
      qb.where('users.is_actived = :is_actived', { is_actived });
    }

    qb.orderBy('users.id', 'ASC');

    // troque "nome" se o campo real do cadastro tiver outro nome
    qb.addOrderBy('cadastros.nome', 'ASC');

    return await qb.getMany();
  }
}

