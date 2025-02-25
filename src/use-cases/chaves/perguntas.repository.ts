
import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { PerguntasEntity } from './chaves.entity';
import type { PerguntasCreate } from './chaves.dto';

export class PerguntasRepository {
  private repo: Repository<PerguntasEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(PerguntasEntity);
  }

  async createPerguntas(perguntas: PerguntasCreate): Promise<PerguntasEntity> {
    const data = this.repo.create(perguntas);
    return this.repo.save(data);
  }

  async updatePerguntas(perguntasId: number, perguntas: DeepPartial<PerguntasEntity>): Promise<PerguntasEntity> {
    const data = this.repo.create({ id: perguntasId, ...perguntas });
    return this.repo.save(data);
  }

  async deletePerguntas(perguntasId: number) {
    return this.repo.delete(perguntasId);
  }
  
  /////////////////////////////////
  
  // Busca todos os registros de Perguntas com condição opcional
  async findPerguntaslAll(where?: FindOptionsWhere<PerguntasEntity>): Promise<PerguntasEntity[]> {
    return this.repo.find({ where });
  }

  // Busca um registro de Perguntas pelo ID
  async findPerguntasById(perguntasId: number): Promise<PerguntasEntity | null> {
    if (!perguntasId || isNaN(perguntasId) || perguntasId <= 0) {
      throw new Error('Invalid perguntaslId');
    }
    return this.repo.findOne({ where: { id: perguntasId } });
  }

  // Busca todos os registros de Perguntas pelo campo descperg
  async findPerguntasAllDescrperg(descrperg: string): Promise<PerguntasEntity[]> {
    return this.repo.find({ where: { descrperg } });
  }
  
  // Busca um registro de Perguntas pelo campo mailresg
  async findPerguntasByDescperg(descrperg: string): Promise<PerguntasEntity | null> {
    return this.repo.findOne({ where: { descrperg } });
  }
}

