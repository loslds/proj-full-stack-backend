

import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { UsersEntity } from './users.entity';
import type { UsersCreate } from './users.dto';

export class UsersRepository {
  private repo: Repository<UsersEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(UsersEntity);
  }

  // Cria um novo registro de users
  
  async createUsers(users: UsersCreate): Promise<UsersEntity> {
    const data = this.repo.create(users);
    return this.repo.save(data);
  }

  // Atualiza um registro de Users pelo ID fornecido
  async updateUsers(
    usersId: number,
    users: DeepPartial<UsersEntity>,
  ): Promise<UsersEntity> {
    if (!usersId || isNaN(usersId) || usersId <= 0) {
      throw new Error('Invalid usersId');
    }

    await this.repo.update(usersId, users);
    const updatedUsers = await this.findUsersById(usersId);

    if (!updatedUsers) {
      throw new Error(`Users with id ${usersId} not found`);
    }

    return updatedUsers;
  }

  // Deleta um registro de Users pelo ID
  async deleteUsers(usersId: number): Promise<void> {
    if (!usersId || isNaN(usersId) || usersId <= 0) {
      throw new Error('Invalid usersId');
    }

    await this.repo.delete(usersId);
  }

  // Busca todos os registros de Users com condição opcional
  async findUsersAll(where?: FindOptionsWhere<UsersEntity>): Promise<UsersEntity[]> {
    return this.repo.find({ where });
  }

  // Busca um registro de Email pelo ID
  async findUsersById(usersId: number): Promise<UsersEntity | null> {
    if (!usersId || isNaN(usersId) || usersId <= 0) {
      throw new Error('Invalid usersId');
    }

    return this.repo.findOne({ where: { id: usersId } });
  }

  // Busca todos os registros de Email pelo campo mail
  async findUsersAllBloqueado(bloqueado: number): Promise<UsersEntity[]> {
    return this.repo.find({ where: { bloqueado } });
  }

  // Busca um registro de Email pelo campo mail
  async findUsersByBloqueado(bloqueado: number): Promise<UsersEntity | null> {
    return this.repo.findOne({ where: { bloqueado } });
  }

  // Busca todos os registros de Email pelo campo mail
  async findUsersAllQddAcesso(qdd_acesso: number): Promise<UsersEntity[]> {
    return this.repo.find({ where: { qdd_acesso } });
  }

  // Busca um registro de Email pelo campo mail
  async findUsersByQddAcesso(qdd_acesso: number): Promise<UsersEntity | null> {
    return this.repo.findOne({ where: { qdd_acesso } });
  }


  // Busca todos os registros de Email pelo campo mailresg
  async findUsersAllUltAcesso(ultimo_acesso: Date): Promise<UsersEntity[]> {
    return this.repo.find({ where: { ultimo_acesso } });
  }

  // Busca um registro de Email pelo campo mailresg
  async findUsersByUltAcesso(ultimo_acesso: Date): Promise<UsersEntity | null> {
    return this.repo.findOne({ where: { ultimo_acesso } });
  }

  // Busca todos os registros de Email pelo campo id_cadastro
  async findEmailByCadastroId(cadastroId: number): Promise<UsersEntity[]> {
    if (!cadastroId || isNaN(cadastroId) || cadastroId <= 0) {
      throw new Error('Invalid cadastroId');
    }

    return this.repo.find({ where: { id_cadastro: cadastroId } });
  }
}
