
import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { FornecedorEntity } from './fornecedor.entity';
import type { FornecedorCreate } from './fornecedor.dto';

export class FornecedorRepository {
  private repo: Repository<FornecedorEntity>;
  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(FornecedorEntity);
  }

  async createFornecedor(fornecedor: FornecedorCreate): Promise<FornecedorEntity> {
    const data = this.repo.create(fornecedor);
    return this.repo.save(data);
  }
  async updateFornecedor(
    fornecedorId: number,
    fornecedor: DeepPartial<FornecedorEntity>,
  ): Promise<FornecedorEntity> {
    const data = this.repo.create({ id: fornecedorId, ...fornecedor });
    return this.repo.save(data);
  }

  async deleteFornecedor(fornecedorId: number) {
    return this.repo.delete(fornecedorId);
  }

  async findFornecedorAll(where?: FindOptionsWhere<FornecedorEntity>): Promise<FornecedorEntity[]> {
    return this.repo.find({ where });
  }

  async findFornecedorById(fornecedorId: number) {
    return this.repo.findOne({ where: { id: fornecedorId } });
  }

  async findFornecedorByName(name: string) {
    return this.repo.findOne({ where: { name } });
  }

  async findFornecedorByFantasy(fantasy: string) {
    return this.repo.findOne({ where: { fantasy } });
  }

  async findFornecedorAllByPessoaId(pessoaId: number): Promise<FornecedorEntity[]> {
    return this.repo.find({ where: { id_pessoa: pessoaId } });
  }

  async findFornecedorAllByEmpresaId(empresaId: number): Promise<FornecedorEntity[]> {
        return this.repo.find({ where: { id_empresa: empresaId } });
  }
  
}

