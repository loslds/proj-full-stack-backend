import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { ModuloEntity } from './modulo.entity';
import type { ModuloCreate } from './modulo.dto';

export class ModuloRepository {
  private repo: Repository<ModuloEntity>;
  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(ModuloEntity);
  }

  async createModulo(modulo: ModuloCreate): Promise<ModuloEntity> {
    const data = this.repo.create(modulo);
    return this.repo.save(data);
  }

  async updateModulo(
    moduloId: number,
    modulo: DeepPartial<ModuloEntity>,
  ): Promise<ModuloEntity> {
    const data = this.repo.create({ id: moduloId, ...modulo });
    return this.repo.save(data);
  }

  async deleteModulo(moduloId: number) {
    return this.repo.delete(moduloId);
  }

  async findModuloAll(where?: FindOptionsWhere<ModuloEntity>): Promise<ModuloEntity[]> {
    return this.repo.find({ where });
  }

  async findModuloById(moduloId: number) {
    return this.repo.findOne({ where: { id: moduloId } });
  }

  async findModuloByName(name: string) {
    return this.repo.findOne({ where: { name } });
  }

}
