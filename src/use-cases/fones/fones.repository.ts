import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { FonesEntity } from './fones.entity';
import type { FonesCreate } from './fones.dto';

export class FonesRepository {
  private repo: Repository<FonesEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(FonesEntity);
  }

  // Cria um novo registro de Fones
  async createFones(fones: FonesCreate): Promise<FonesEntity> {
    const data = this.repo.create(fones);
    return this.repo.save(data);
  }

  // Atualiza um registro de Fones pelo ID fornecido
  async updateFones(
    fonesId: number,
    fones: DeepPartial<FonesEntity>,
  ): Promise<FonesEntity> {
    if (!fonesId || isNaN(fonesId) || fonesId <= 0) {
      throw new Error('Invalid fonesId');
    }

    await this.repo.update(fonesId, fones);
    const updatedFones = await this.findFonesById(fonesId);

    if (!updatedFones) {
      throw new Error(`Fones with id ${fonesId} not found`);
    }

    return updatedFones;
  }

  // Deleta um registro de Fones pelo ID
  async deleteFones(fonesId: number): Promise<void> {
    if (!fonesId || isNaN(fonesId) || fonesId <= 0) {
      throw new Error('Invalid docsIdId');
    }
    await this.repo.delete(fonesId);
  }

  // Busca todos os registros de Fones com condição opcional
  async findFonesAll(where?: FindOptionsWhere<FonesEntity>): Promise<FonesEntity[]> {
    return this.repo.find({ where });
  }

  // Busca um registro de Fones pelo ID
  async findFonesById(fonesId: number): Promise<FonesEntity | null> {
    if (!fonesId || isNaN(fonesId) || fonesId <= 0) {
      throw new Error('Invalid docsId');
    }
    return this.repo.findOne({ where: { id: fonesId } });
  }
//////////////////////////
  // Busca todos os registros de Fones pelo campo fonex
  async findFonesAllFonex(fonex: string): Promise<FonesEntity[]> {
    return this.repo.find({ where: { fonex } });
  }

  // Busca um registro de Fones pelo campo fonex
  async findFonesByFonex(fonex: string): Promise<FonesEntity | null> {
    return this.repo.findOne({ where: { fonex } });
  }
///////////////////////
  // Busca todos os registros de Fones pelo campo fonec
  async findFonesAllFonec(fonec: string): Promise<FonesEntity[]> {
    return this.repo.find({ where: { fonec } });
  }

  // Busca um registro de Fones pelo campo fonec
  async findFonesByFonec(fonec: string): Promise<FonesEntity | null> {
    return this.repo.findOne({ where: { fonec } });
  }
////////////////////
  // Busca todos os registros de Fones pelo campo fonez
  async findFonesAllFonez(fonez: string): Promise<FonesEntity[]> {
    return this.repo.find({ where: { fonez } });
  }

  // Busca um registro de Fones pelo campo fonez
  async findFonesByFonez(fonez: string): Promise<FonesEntity | null> {
    return this.repo.findOne({ where: { fonez } });
  }
///////////////////////////  
  
  // Busca todos os registros de Docs pelo campo id_cadastro
  async findFonesByCadastroId(cadastroId: number): Promise<FonesEntity[]> {
    if (!cadastroId || isNaN(cadastroId) || cadastroId <= 0) {
      throw new Error('Invalid cadastroId');
    }
    return this.repo.find({ where: { id_cadastro: cadastroId } });
  }
}
