import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { EmpresaEntity } from './empresa.entity';
import type { EmpresaCreate } from './empresa.dto';

export class EmpresaRepository {
  private repo: Repository<EmpresaEntity>;
  
  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(EmpresaEntity);
  }

  // Cria um registro na tabela Empresa
  async createEmpresa(empresa: EmpresaCreate): Promise<EmpresaEntity> {
    const data = this.repo.create(empresa);
    return this.repo.save(data);
  }

  // Atualiza o conteúdo de um registro de Empresa com o ID fornecido
  async updateEmpresa(
    empresaId: number,
    empresa: DeepPartial<EmpresaEntity>,
  ): Promise<EmpresaEntity> {
    const data = this.repo.create({ id: empresaId, ...empresa });
    return this.repo.save(data);
  }

  // Deleta um registro de Empresa pelo ID
  async deleteEmpresa(empresaId: number) {
    return this.repo.delete(empresaId);
  }

  // Busca todos os registros de Empresa, com filtro opcional
  async findEmpresaAll(where?: FindOptionsWhere<EmpresaEntity>): Promise<EmpresaEntity[]> {
    return this.repo.find({ where });
  }

  // Busca um registro de Empresa pelo ID
  async findEmpresaById(empresaId: number) {
    return this.repo.findOne({ where: { id: empresaId } });
  }

  // Busca um registro de Empresa pelo nome
  async findEmpresaByName(name: string) {
    return this.repo.findOne({ where: { name } });
  }

  // Busca um registro de Empresa pelo nome fantasia
  async findEmpresaByFantasy(fantasy: string) {
    return this.repo.findOne({ where: { fantasy } });
  }

  // Busca todos os registros de Empresa com mesmo id_pessoa
  async findEmpresaByPessoaId(pessoaId: number): Promise<EmpresaEntity[]> {
      return this.repo.find({ where: { id_pessoa: pessoaId } });
    }
}
