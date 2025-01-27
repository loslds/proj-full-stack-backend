
import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { ClientesEntity } from './clientes.entity';
import type { ClientesCreate } from './clientes.dto';

export class ClientesRepository {
  private repo: Repository<ClientesEntity>;
  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(ClientesEntity);
  }

  async createClientes(clientes: ClientesCreate): Promise<ClientesEntity> {
    const data = this.repo.create(clientes);
    return this.repo.save(data);
  }

  async updateClientes(
    clientesId: number,
    clientes: DeepPartial<ClientesEntity>,
  ): Promise<ClientesEntity> {
    const data = this.repo.create({ id: clientesId, ...clientes });
    return this.repo.save(data);
  }

  async deleteClientes(clientesId: number) {
    return this.repo.delete(clientesId);
  }

  async findClientesAll(where?: FindOptionsWhere<ClientesEntity>): Promise<ClientesEntity[]> {
    return this.repo.find({ where });
  }

  async findClientesById(clientesId: number) {
    return this.repo.findOne({ where: { id: clientesId } });
  }

  async findClientesByName(name: string) {
    return this.repo.findOne({ where: { name } });
  }

  async findClientesByFantasy(fantasy: string) {
    return this.repo.findOne({ where: { fantasy } });
  }

  async findClientesAllPessoaId(pessoaId: number): Promise<ClientesEntity[]> {
    return this.repo.find({ where: { id_pessoa: pessoaId } });
  }

  async findClientesAllEmpresaId(empresaId: number): Promise<ClientesEntity[]> {
        return this.repo.find({ where: { id_empresa: empresaId } });
  }
  
}

