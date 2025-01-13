
import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { ConsumidorEntity } from './consumidor.entity';
import type { ConsumidorCreate } from './consumidor.dto';

export class ConsumidorRepository {
  private repo: Repository<ConsumidorEntity>;
  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(ConsumidorEntity);
  }

  async createConsumidor(consumidor: ConsumidorCreate): Promise<ConsumidorEntity> {
    const data = this.repo.create(consumidor);
    return this.repo.save(data);
  }

  async updateConsumidor(
    consumidorId: number,
    consumidor: DeepPartial<ConsumidorEntity>,
  ): Promise<ConsumidorEntity> {
    const data = this.repo.create({ id: consumidorId, ...consumidor });
    return this.repo.save(data);
  }

  async deleteConsumidor(clienteId: number) {
    return this.repo.delete(clienteId);
  }

  async findConsumidorAll(where?: FindOptionsWhere<ConsumidorEntity>): Promise<ConsumidorEntity[]> {
    return this.repo.find({ where });
  }

  async findConsumidorById(consumidorId: number) {
    return this.repo.findOne({ where: { id: consumidorId } });
  }

  async findConsumidorByName(name: string) {
    return this.repo.findOne({ where: { name } });
  }

  async findConsumidorByFantasy(fantasy: string) {
    return this.repo.findOne({ where: { fantasy } });
  }

  async findConsumidorByPessoaId(pessoaId: number): Promise<ConsumidorEntity[]> {
    return this.repo.find({ where: { id_pessoa: pessoaId } });
  }

  async findConsumidorByEmpresaId(empresaId: number): Promise<ConsumidorEntity[]> {
      return this.repo.find({ where: { id_empresa: empresaId } });
    }

}

