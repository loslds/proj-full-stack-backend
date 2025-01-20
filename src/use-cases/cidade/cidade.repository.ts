import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { CidadeEntity } from './cidade.entity';
import type { CidadeCreate } from './cidade.dto';

export class CidadeRepository {
  private repo: Repository<CidadeEntity>;
  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(CidadeEntity);
  }

  // Cria um registro na tabela Cidade
  async createCidade(cidade: CidadeCreate): Promise<CidadeEntity> {
    const data = this.repo.create(cidade);
    return this.repo.save(data);
  }

  // Atualiza o conteúdo de um registro de Cidade com o ID fornecido
  async updateCidade(
    cidadeId: number,
    cidade: DeepPartial<CidadeEntity>,
  ): Promise<CidadeEntity> {
    const data = this.repo.create({ id: cidadeId, ...cidade });
    return this.repo.save(data);
  }

  // Deleta um registro de Cidade pelo ID
  async deleteCidade(cidadeId: number) {
    return this.repo.delete(cidadeId);
  }

  // Busca todos os registros de Cidade, com filtro opcional
  async findCidadeAll(where?: FindOptionsWhere<CidadeEntity>): Promise<CidadeEntity[]> {
    return this.repo.find({ where });
  }

  // Busca um registro de Cidade pelo ID
  async findCidadeById(cidadeId: number) {
    return this.repo.findOne({ where: { id: cidadeId } });
  }

  // Busca um registro de Cidade pelo nome da Cidade
  async findCidadeByNmCidade(nmcidade: string) {
    return this.repo.findOne({ where: { nmcidade } });
  }

  // Busca um registro de Cidade pelo nome do Estado
  async findCidadeByNmEstado(nmestado: string) {
    return this.repo.findOne({ where: { nmestado } });
  }

  // Busca todos os registros de Cidades a mesma uf
  async findAllCidadesByUf(uf: string) {
      return this.repo.find({ where: { uf } });
    }

}
