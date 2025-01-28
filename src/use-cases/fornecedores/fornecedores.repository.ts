

import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { FornecedoresEntity } from './fornecedores.entity';
import type { FornecedoresCreate } from './fornecedores.dto';

export class FornecedoresRepository {
  private repo: Repository<FornecedoresEntity>;
  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(FornecedoresEntity);
  }

  async createFornecedores(fornecedores: FornecedoresCreate): Promise<FornecedoresEntity> {
    const data = this.repo.create(fornecedores);
    return this.repo.save(data);
  }
  async updateFornecedores(
    fornecedoresId: number,
    fornecedores: DeepPartial<FornecedoresEntity>,
  ): Promise<FornecedoresEntity> {
    const data = this.repo.create({ id: fornecedoresId, ...fornecedores });
    return this.repo.save(data);
  }

  async deleteFornecedores(fornecedoresId: number) {
    return this.repo.delete(fornecedoresId);
  }

  async findFornecedoresAll(where?: FindOptionsWhere<FornecedoresEntity>): Promise<FornecedoresEntity[]> {
    return this.repo.find({ where });
  }

  async findFornecedoresById(fornecedoresId: number) {
    return this.repo.findOne({ where: { id: fornecedoresId } });
  }

  async findFornecedoresByName(name: string) {
    return this.repo.findOne({ where: { name } });
  }

  async findFornecedoresByFantasy(fantasy: string) {
    return this.repo.findOne({ where: { fantasy } });
  }

  async findFornecedoresAllByPessoaId(pessoaId: number): Promise<FornecedoresEntity[]> {
    return this.repo.find({ where: { id_pessoa: pessoaId } });
  }

  async findFornecedoresAllByEmpresaId(empresaId: number): Promise<FornecedoresEntity[]> {
        return this.repo.find({ where: { id_empresa: empresaId } });
  }
  
}

