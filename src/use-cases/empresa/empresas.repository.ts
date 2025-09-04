import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { EmpresasEntity } from './empresas.entity';
import type { EmpresasCreate } from './empresas.dto';

export class EmpresasRepository {
  private repo: Repository<EmpresasEntity>;
  
  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(EmpresasEntity);
  }

  async hasDuplicated(nome?: string, fantasy?: string, excludes: number[] = []) { 
    const query = this.repo.createQueryBuilder('empresas')
      .select()
      .where('empresas.nome LIKE :nome', {nome})
      .andWhere('empresas.fantasy LIKE :fantasy', {fantasy})
  
    if(!!excludes?.length) {
      query.andWhere('empresas.id NOT IN(:...excludes)',{ excludes })
    }
  
    const result = await query.getOne()
    
    return result
  }
  
  // pesquisa empresas conforme o parametro setado ID, NOME, FANTASY
  async searchEmpresas(params: { id?: number; nome?: string; fantasy?: string }) {
    const query = this.repo.createQueryBuilder('empresas')
      .select(['empresas.id', 'empresas.nome', 'empresas.fantasy'])
      .orderBy('empresas.id', 'ASC');

    if (params.id) {
      query.andWhere('empresas.id = :id', { id: params.id });
    }

    if (params.nome) {
      query.andWhere('empresas.nome LIKE :nome', { nome: `%${params.nome}%` });
    }

    if (params.fantasy) {
      query.andWhere('empresas.fantasy LIKE :fantasy', { fantasy: `%${params.fantasy}%` });
    }

    return query.getMany();
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
  async findEmpresasByName(nome: string) {
    return this.repo.findOne({ where: { nome } });
  }

  // Busca um registro de Empresas pelo nome fantasia
  async findEmpresasByFantasy(fantasy: string) {
    return this.repo.findOne({ where: { fantasy } });
  }

  // Busca todos os registros de Empresa com mesmo id_pessoas
  async findEmpresasByPessoaId(pessoaId: number): Promise<EmpresasEntity[]> {
      return this.repo.find({ where: { id_pessoa: pessoaId } });
    }
}
