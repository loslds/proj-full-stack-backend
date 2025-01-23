import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { CodsegsEntity } from './codsegs.entity';
import type { CodsegsCreate } from './codsegs.dto';

export class CodsegsRepository {
  private repo: Repository<CodsegsEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(CodsegsEntity);
  }

  // Cria um novo registro de Codsegs
  async createCodsegs(codsegs: CodsegsCreate): Promise<CodsegsEntity> {
    const data = this.repo.create(codsegs);
    return this.repo.save(data);
  }

  // Atualiza um registro de Docs pelo ID fornecido
  async updateCodsegs(
    codsegsId: number,
    codsegs: DeepPartial<CodsegsEntity>,
  ): Promise<CodsegsEntity> {
    if (!codsegsId || isNaN(codsegsId) || codsegsId <= 0) {
      throw new Error('Invalid codsegsId');
    }

    await this.repo.update(codsegsId, codsegs);
    const updatedCodsegs = await this.findCodsegsById(codsegsId);

    if (!updatedCodsegs) {
      throw new Error(`Codsegs with id ${codsegs} not found`);
    }

    return updatedCodsegs;
  }

  // Deleta um registro de Codsegs pelo ID
  async deleteCodsegs(codsegsId: number): Promise<void> {
    if (!codsegsId || isNaN(codsegsId) || codsegsId <= 0) {
      throw new Error('Invalid codsegsId');
    }

    await this.repo.delete(codsegsId);
  }

  // Busca todos os registros de Codsegs com condição opcional
  async findCodsegsAll(where?: FindOptionsWhere<CodsegsEntity>): Promise<CodsegsEntity[]> {
    return this.repo.find({ where });
  }

  // Busca um registro de Codsegs pelo ID
  async findCodsegsById(codsegsId: number): Promise<CodsegsEntity | null> {
    if (!codsegsId || isNaN(codsegsId) || codsegsId <= 0) {
      throw new Error('Invalid codsegsId');
    }
    return this.repo.findOne({ where: { id: codsegsId } });
  }

  // Busca todos os registros de Docs pelo campo codigo
  async findCodsegsAllCodigo(codigo: string): Promise<CodsegsEntity[]> {
    return this.repo.find({ where: { codigo } });
  }

  // Busca um registro de Codsegs pelo campo inscre
  async findCodsegsByCodigo(codigo: string): Promise<CodsegsEntity | null> {
    return this.repo.findOne({ where: { codigo } });
  }
  
  // Busca todos os registros de Docs pelo campo id_cadastro
  async findCodsegsByCadastroId(cadastroId: number): Promise<CodsegsEntity[]> {
    if (!cadastroId || isNaN(cadastroId) || cadastroId <= 0) {
      throw new Error('Invalid cadastroId');
    }

    return this.repo.find({ where: { id_cadastro: cadastroId } });
  }
}
