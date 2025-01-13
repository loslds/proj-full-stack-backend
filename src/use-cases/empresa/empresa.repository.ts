 
import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { EmpresaEntity } from './empresa.entity';
import type { EmpresaCreate } from './empresa.dto';

export class EmpresaRepository {
  private repo: Repository<EmpresaEntity>;
  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(EmpresaEntity);
  }

  async createEmpresa(empresa: EmpresaCreate): Promise<EmpresaEntity> {
    const data = this.repo.create(empresa);
    return this.repo.save(data);
  }

  async updateEmpresa(
    empresaId: number,
    empresa: DeepPartial<EmpresaEntity>,
  ): Promise<EmpresaEntity> {
    const data = this.repo.create({ id: empresaId, ...empresa });
    return this.repo.save(data);
  }

  async deleteEmpresa(empresaId: number) {
    return this.repo.delete(empresaId);
  }

  async findEmpresaAll(where?: FindOptionsWhere<EmpresaEntity>): Promise<EmpresaEntity[]> {
    return this.repo.find({ where });
  }

  async findEmpresaById(empresaId: number) {
    return this.repo.findOne({ where: { id: empresaId } });
  }

  async findEmpresaByName(name: string) {
    return this.repo.findOne({ where: { name } });
  }

  async findEmpresaByFantasy(fantasy: string) {
    return this.repo.findOne({ where: { fantasy } });
  }

  
  async findEmpresasAllByIdPessoa(pessoaId: number): Promise<EmpresaEntity[]> {
    return this.repo.find({ where: { id_pessoa: pessoaId } });
  }
}

