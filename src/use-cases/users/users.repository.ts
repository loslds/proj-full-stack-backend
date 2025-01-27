

import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { UsersEntity } from './users.entity';
import type { UsersCreate } from './users.dto';

export class UsersRepository {
  private repo: Repository<UsersEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(UsersEntity);
  }

  // Cria um novo registro de Users
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
    const updatedusers = await this.findUsersById(usersId);

    if (!updatedusers) {
      throw new Error(`Users with id ${usersId} not found`);
    }

    return updatedusers;
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

  // Busca um registro de Users pelo ID
  async findUsersById(usersId: number): Promise<UsersEntity | null> {
    if (!usersId || isNaN(usersId) || usersId <= 0) {
      throw new Error('Invalid usersId');
    }
    return this.repo.findOne({ where: { id: usersId } });
  }
//////////////////////////
  // Busca todos os registros de Users pelo campo bloqueado
  async findUsersAllBloqueado( bloqueado: number ): Promise<UsersEntity[]> {
    return this.repo.find({ where: { bloqueado } });
  }

  // Busca um registro de User pelo campo bloqueado
  async findUsersByBloqueado(bloqueado: number): Promise<UsersEntity | null> {
    return this.repo.findOne({ where: { bloqueado } });
  }
  ///////////////////////
  // Busca todos os registros de Users pelo campo ult_acesso
  async findUsersAllQdd_Acesso(qdd_acesso: number): Promise<UsersEntity[]> {
    return this.repo.find({ where: { qdd_acesso } });
  }

  // Busca um registro de User pelo campo fonec
  async findUserByQdd_Acesso(qdd_acesso: number): Promise<UsersEntity | null> {
    return this.repo.findOne({ where: { qdd_acesso } });
  }
  ///////////////////////
  // Busca todos os registros de Users pelo campo ult_acesso
  async findUsersAllUlt_Acesso(ult_acesso: Date): Promise<UsersEntity[]> {
    return this.repo.find({ where: { ult_acesso } });
  }

  // Busca um registro de Fones pelo campo ult_acesso
  async findUsersByUlt_Acesso(ult_acesso: Date): Promise<UsersEntity | null> {
    return this.repo.findOne({ where: { ult_acesso } });
  }
////////////////////
  // Busca todos os registros de User pelo campo data_login
  async findUsersAllData_Login(data_login: Date): Promise<UsersEntity[]> {
    return this.repo.find({ where: { data_login} });
  }

  // Busca um registro de User pelo campo fonez
  async findUsersByData_Login(data_login: Date): Promise<UsersEntity | null> {
    return this.repo.findOne({ where: { data_login } });
  }
/////////////////////////// 
  // Busca todos os registros de User pelo campo data_login
  async findUsersAllData_Logout(data_login: Date): Promise<UsersEntity[]> {
    return this.repo.find({ where: { data_login} });
  }

  // Busca um registro de User pelo campo fonez
  async findUsersByData_Logout(data_logout: Date): Promise<UsersEntity | null> {
    return this.repo.findOne({ where: { data_logout } });
  }
///////////////////////////

  
  // Busca todos os registros de Docs pelo campo id_cadastro
  async findUsersByCadastroId(cadastroId: number): Promise<UsersEntity[]> {
    if (!cadastroId || isNaN(cadastroId) || cadastroId <= 0) {
      throw new Error('Invalid cadastroId');
    }
    return this.repo.find({ where: { id_cadastro: cadastroId } });
  }
}
