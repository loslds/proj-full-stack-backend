
import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { FuncionarioEntity } from './funcionario.entity';
import type { FuncionarioCreate } from './funcionario.dto';

export class FuncionarioRepository {
  private repo: Repository<FuncionarioEntity>;
  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(FuncionarioEntity);
  }

  async createFuncionario(funcionario: FuncionarioCreate): Promise<FuncionarioEntity> {
    const data = this.repo.create(funcionario);
    return this.repo.save(data);
  }
  async updateFuncionario(
    funcionarioId: number,
    funcionario: DeepPartial<FuncionarioEntity>,
  ): Promise<FuncionarioEntity> {
    const data = this.repo.create({ id: funcionarioId, ...funcionario });
    return this.repo.save(data);
  }

  async deleteFuncionario(funcionarioId: number) {
    return this.repo.delete(funcionarioId);
  }

  async findFuncionarioAll(where?: FindOptionsWhere<FuncionarioEntity>): Promise<FuncionarioEntity[]> {
    return this.repo.find({ where });
  }

  async findFuncionarioById(funcionarioId: number) {
    return this.repo.findOne({ where: { id: funcionarioId } });
  }

  async findFuncionarioByName(name: string) {
    return this.repo.findOne({ where: { name } });
  }

  async findFuncionarioByFantasy(fantasy: string) {
    return this.repo.findOne({ where: { fantasy } });
  }

  async findFuncionarioAllByPessoaId(pessoaId: number): Promise<FuncionarioEntity[]> {
    return this.repo.find({ where: { id_pessoa: pessoaId } });
  }

  async findFuncionarioAllByEmpresaId(empresaId: number): Promise<FuncionarioEntity[]> {
        return this.repo.find({ where: { id_empresa: empresaId } });
  }
  
}

