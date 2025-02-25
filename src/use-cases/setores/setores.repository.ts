import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { SetoresEntity } from './setores.entity';
import type { SetoresCreate } from './setores.dto';

export class SetoresRepository {
  private repo: Repository<SetoresEntity>;
  
  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(SetoresEntity);
  }

  // Cria um registro na tabela Empresas
    async createSetores(setores: SetoresCreate): Promise<SetoresEntity> {
      const data = this.repo.create(setores);
      return this.repo.save(data);
    }
  
    // Atualiza o conteúdo de um registro de Setores com o ID fornecido
    async updateSetores(
      setoresId: number,
      setores: DeepPartial<SetoresEntity>,
    ): Promise<SetoresEntity> {
      const data = this.repo.create({ id: setoresId, ...setores });
      return this.repo.save(data);
    }
  
    // Deleta um registro de Setores pelo ID
    async deleteSetores(setoresId: number) {
      return this.repo.delete(setoresId);
    }
  
    // Busca todos os registros de Setores, com filtro opcional
    async findSetoresAll(where?: FindOptionsWhere<SetoresEntity>): Promise<SetoresEntity[]> {
      return this.repo.find({ where });
    }
  
    // Busca um registro de Empresas pelo ID
    async findSetoresById(setoresId: number) {
      return this.repo.findOne({ where: { id: setoresId } });
    }
  
    // Busca um registro de Setores pelo nome
    async findSetoresByName(name: string) {
      return this.repo.findOne({ where: { name } });
    }
  
    // Busca um registro de Setores pelo acao
    async findSetoresAllAcao(acao: string) {
      return this.repo.find({ where: { acao } });
    }

    // Busca um registro de Setores pelo nivel
    async findSetoresAllNivel(nivel: number) {
      return this.repo.find({ where: { nivel } });
    }
    
  }
  