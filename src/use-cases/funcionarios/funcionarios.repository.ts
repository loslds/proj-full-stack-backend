
import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { FuncionariosEntity } from './funcionarios.entity';
import type { FuncionariosCreate } from './funcionarios.dto';

export class FuncionariosRepository {
  private repo: Repository<FuncionariosEntity>;
  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(FuncionariosEntity);
  }

  async createFuncionarios(funcionarios: FuncionariosCreate): Promise<FuncionariosEntity> {
    const data = this.repo.create(funcionarios);
    return this.repo.save(data);
  }
  async updateFuncionarios(
    funcionariosId: number,
    funcionarios: DeepPartial<FuncionariosEntity>,
  ): Promise<FuncionariosEntity> {
    const data = this.repo.create({ id: funcionariosId, ...funcionarios });
    return this.repo.save(data);
  }

  async deleteFuncionarios(funcionariosId: number) {
    return this.repo.delete(funcionariosId);
  }

  async findFuncionariosAll(where?: FindOptionsWhere<FuncionariosEntity>): Promise<FuncionariosEntity[]> {
    return this.repo.find({ where });
  }

  async findFuncionariosById(funcionariosId: number) {
    return this.repo.findOne({ where: { id: funcionariosId } });
  }

  async findFuncionariosByName(name: string) {
    return this.repo.findOne({ where: { name } });
  }

  async findFuncionariosByFantasy(fantasy: string) {
    return this.repo.findOne({ where: { fantasy } });
  }

  async findFuncionariosAllByPessoaId(pessoaId: number): Promise<FuncionariosEntity[]> {
    return this.repo.find({ where: { id_pessoa: pessoaId } });
  }

  async findFuncionariosAllByEmpresaId(empresaId: number): Promise<FuncionariosEntity[]> {
        return this.repo.find({ where: { id_empresa: empresaId } });
  }
  
}

