
import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { ConsumidoresEntity } from './consumidores.entity';
import type { ConsumidoresCreate } from './consumidores.dto';

export class ConsumidoresRepository {
  private repo: Repository<ConsumidoresEntity>;
  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(ConsumidoresEntity);
  }

  async createConsumidores(consumidores: ConsumidoresCreate): Promise<ConsumidoresEntity> {
    const data = this.repo.create(consumidores);
    return this.repo.save(data);
  }

  async updateConsumidores(
    consumidoresId: number,
    consumidores: DeepPartial<ConsumidoresEntity>,
  ): Promise<ConsumidoresEntity> {
    const data = this.repo.create({ id: consumidoresId, ...consumidores });
    return this.repo.save(data);
  }
  
  async deleteConsumidores(consumidoresId: number) {
    return this.repo.delete(consumidoresId);
  }

  async findConsumidoresAll(where?: FindOptionsWhere<ConsumidoresEntity>): Promise<ConsumidoresEntity[]> {
    return this.repo.find({ where });
  }

  async findConsumidoresById(consumidoresId: number) {
    return this.repo.findOne({ where: { id: consumidoresId } });
  }

  async findConsumidoresByName(name: string) {
    return this.repo.findOne({ where: { name } });
  }

  async findConsumidoresByFantasy(fantasy: string) {
    return this.repo.findOne({ where: { fantasy } });
  }

  async findConsumidoresAllByPessoaId(pessoaId: number): Promise<ConsumidoresEntity[]> {
    return this.repo.find({ where: { id_pessoa: pessoaId } });
  }

  async findConsumidoresAllByEmpresaId(empresaId: number): Promise<ConsumidoresEntity[]> {
      return this.repo.find({ where: { id_empresa: empresaId } });
    }

}
