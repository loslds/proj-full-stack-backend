
import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { ClienteEntity } from './cliente.entity';
import type { ClienteCreate } from './cliente.dto';

export class ClienteRepository {
  private repo: Repository<ClienteEntity>;
  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(ClienteEntity);
  }

  async createCliente(cliente: ClienteCreate): Promise<ClienteEntity> {
    const data = this.repo.create(cliente);
    return this.repo.save(data);
  }

  async updateCliente(
    clienteId: number,
    cliente: DeepPartial<ClienteEntity>,
  ): Promise<ClienteEntity> {
    const data = this.repo.create({ id: clienteId, ...cliente });
    return this.repo.save(data);
  }

  async deleteCliente(clienteId: number) {
    return this.repo.delete(clienteId);
  }

  async findClienteAll(where?: FindOptionsWhere<ClienteEntity>): Promise<ClienteEntity[]> {
    return this.repo.find({ where });
  }

  async findClienteById(clienteId: number) {
    return this.repo.findOne({ where: { id: clienteId } });
  }

  async findClienteByName(name: string) {
    return this.repo.findOne({ where: { name } });
  }

  async findClienteByFantasy(fantasy: string) {
    return this.repo.findOne({ where: { fantasy } });
  }

  async findClientesAllByPessoaId(pessoaId: number): Promise<ClienteEntity[]> {
    return this.repo.find({ where: { id_pessoa: pessoaId } });
  }

  async findClientesAllByEmpresaId(empresaId: number): Promise<ClienteEntity[]> {
        return this.repo.find({ where: { id_empresa: empresaId } });
  }
  
}

