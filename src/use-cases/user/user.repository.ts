import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import type { UserCreate } from './user.dto';

export class UserRepository {
  private repo: Repository<UserEntity>;
  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(UserEntity);
  }

  async create(user: UserCreate): Promise<UserEntity> {
    const data = this.repo.create(user);
    return this.repo.save(data);
  }

  async update(
    userId: number,
    user: DeepPartial<UserEntity>,
  ): Promise<UserEntity> {
    const data = this.repo.create({ id: userId, ...user });
    return this.repo.save(data);
  }

  async delete(userId: number) {
    return this.repo.delete(userId);
  }

  async findAll(where?: FindOptionsWhere<UserEntity>): Promise<UserEntity[]> {
    return this.repo.find({ where });
  }

  async findUserById(userId: number) {
    return this.repo.findOne({ where: { id: userId } });
  }

  async findUserByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }
}
