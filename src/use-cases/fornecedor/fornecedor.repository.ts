
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

  async findAllFornecedor(where?: FindOptionsWhere<FornecedorEntity>): Promise<FornecedorEntity[]> {
    return this.repo.find({ where });
  }

  async findByIdFornecedor(fornecedorId: number) {
    return this.repo.findOne({ where: { id: fornecedorId } });
  }

  async findByNameFornecedor(name: string) {
    return this.repo.findOne({ where: { name } });
  }

  async findByFantasyFornecedor(fantasy: string) {
    return this.repo.findOne({ where: { fantasy } });
  }
  // busca todos os reg. id_pessoas dentro de fornecedor
  async findAllFornecedorByPessoaId(pessoaId: number): Promise<FornecedorEntity[]> {
    return this.repo.find({ where: { id_pessoa: pessoaId } });
  }
  
  // busca todos os reg. id_empresa dentro de fornecedor
  async findAllFornecedorByEmpresaId(empresaId: number): Promise<FornecedorEntity[]> {
    return this.repo.find({ where: { id_empresa: empresaId } });
  }

}

