import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { CidadesEntity } from './cidades.entity';
import type { CidadesCreate } from './cidades.dto';

export class CidadesRepository {
  private repo: Repository<CidadesEntity>;
  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(CidadesEntity);
  }

  // Cria um registro na tabela Cidades
  async createCidades(cidades: CidadesCreate): Promise<CidadesEntity> {
    const data = this.repo.create(cidades);
    return this.repo.save(data);
  }

  // Atualiza o conteúdo de um registro de Cidades com o ID fornecido
  async updateCidades(
    cidadesId: number,
    cidades: DeepPartial<CidadesEntity>,
  ): Promise<CidadesEntity> {
    const data = this.repo.create({ id: cidadesId, ...cidades });
    return this.repo.save(data);
  }

  // Deleta um reg. Cidades pelo ID
  async deleteCidades(cidadesId: number) {
    return this.repo.delete(cidadesId);
  }

    // Busca um reg. Cidades pelo ID
  async findCidadesById(cidadesId: number) {
    return this.repo.findOne({ where: { id: cidadesId } });
  }
  // Busca todos reg. em Cidade.
  async findCidadesAll(where?: FindOptionsWhere<CidadesEntity>): Promise<CidadesEntity[]> {
    return this.repo.find({ where });
  }
  // Busca um reg. nmcidade em Cidades
  async findCidadesByNmCidade(nmcidade: string) {
    return this.repo.findOne({ where: { nmcidade } });
  }
  // Busca todos reg. nmcidade em Cidades
  async findCidadesAllNmCidade(nmcidade: string) {
    return this.repo.find({ where: { nmcidade } });
  }
  // Busca um reg. nmestado em Cidades
  async findCidadesByNmEstado(nmestado: string) {
    return this.repo.findOne({ where: { nmestado } });
  }
  // Busca todos reg. nmestado em Cidade
  async findCidadesAllNmEstado(nmestado: string) {
    return this.repo.find({ where: { nmestado } });
  }
  // Busca todos reg. uf em Cidades
    async findCidadesAllUf(uf: string) {
      return this.repo.find({ where: { uf } });
    }
  // Busca todos os registros de Cidades pelo campo id_cadastro
  async findCidadesByCadastrosId(cadastrosId: number): Promise<CidadesEntity[]> {
    if (!cadastrosId || isNaN(cadastrosId) || cadastrosId <= 0) {
      throw new Error('Invalid cadastroId');
    }

    return this.repo.find({ where: { id_cadastros: cadastrosId } });
  }
}
