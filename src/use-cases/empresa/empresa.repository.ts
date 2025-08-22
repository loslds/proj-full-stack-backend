import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { EmpresasEntity } from './empresa.entity';
import type { EmpresasCreate } from './empresa.dto';

export class EmpresasRepository {
  private repo: Repository<EmpresasEntity>;
  
  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(EmpresasEntity);
  }

  async hasDuplicated(nmempresa?: string, fantasy?: string, excludes: number[] = []) { 
      const query = this.repo.createQueryBuilder('Empresas')
      .select()
      .where('Pessoas.nmpessoa LIKE :nmempresa', {nmempresa})
      .andWhere('Pessoas.sigla LIKE :sigla', {fantasy})
  
      if(!!excludes?.length) {
        query.andWhere('Pessoas.id NOT IN(:...excludes)',{ excludes })
      }
  
      const result = await query.getOne()
      return result
    }
  
  
  // Cria um registro na tabela Empresas
  async createEmpresas(empresas: EmpresasCreate): Promise<EmpresasEntity> {
    const data = this.repo.create(empresas);
    return this.repo.save(data);
  }

  // Atualiza o conteúdo de um registro de Empresas com o ID fornecido
  async updateEmpresas(
    empresasId: number,
    empresas: DeepPartial<EmpresasEntity>,
  ): Promise<EmpresasEntity> {
    const data = this.repo.create({ id: empresasId, ...empresas });
    return this.repo.save(data);
  }

  // Deleta um registro de Empresas pelo ID
  async deleteEmpresas(empresasId: number) {
    return this.repo.delete(empresasId);
  }

  // Busca todos os registros de Empresas, com filtro opcional
  async findEmpresasAll(where?: FindOptionsWhere<EmpresasEntity>): Promise<EmpresasEntity[]> {
    return this.repo.find({ where });
  }

  // Busca um registro de Empresas pelo ID
  async findEmpresasById(empresasId: number) {
    return this.repo.findOne({ where: { id: empresasId } });
  }

  // Busca um registro de Empresas pelo nome
  async findEmpresasByName(nmempresa: string) {
    return this.repo.findOne({ where: { nmempresa } });
  }

  // Busca um registro de Empresas pelo nome fantasia
  async findEmpresasByFantasy(fantasy: string) {
    return this.repo.findOne({ where: { fantasy } });
  }

  // Busca todos os registros de Empresa com mesmo id_pessoa
  async findEmpresasByPessoaId(pessoaId: number): Promise<EmpresasEntity[]> {
      return this.repo.find({ where: { id_pessoa: pessoaId } });
    }
}
