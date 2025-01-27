import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { PessoasEntity } from './pessoas.entity';
import type { PessoasCreate } from './pessoas.dto';

export class PessoasRepository {
  private repo: Repository<PessoasEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(PessoasEntity);
  }

  async createPessoas(pessoas: PessoasCreate): Promise<PessoasEntity> {
    const data = this.repo.create(pessoas);
    return this.repo.save(data);
  }

  async updatePessoas(pessoasId: number, pessoas: DeepPartial<PessoasEntity>): Promise<PessoasEntity> {
    const data = this.repo.create({ id: pessoasId, ...pessoas });
    return this.repo.save(data);
  }

  async deletePessoas(pessoasId: number) {
    return this.repo.delete(pessoasId);
  }
  
  /////////////////////////////////
  
  // Busca todos os registros de Pessoas com condição opcional
  async findPessoaslAll(where?: FindOptionsWhere<PessoasEntity>): Promise<PessoasEntity[]> {
    return this.repo.find({ where });
  }

  // Busca um registro de Pessoas pelo ID
  async findPessoasById(pessoasId: number): Promise<PessoasEntity | null> {
    if (!pessoasId || isNaN(pessoasId) || pessoasId <= 0) {
      throw new Error('Invalid pessoasId');
    }
    return this.repo.findOne({ where: { id: pessoasId } });
  }


  // Busca todos os registros de Pessoas pelo campo nmpessoa
  async findPessoasAllNmpessoa(nmpessoa: string): Promise<PessoasEntity[]> {
    return this.repo.find({ where: { nmpessoa } });
  }
  
  // Busca um registro de Pessoas pelo campo nmpessoa
  async findPessoasByNmpessoa(nmpessoa: string): Promise<PessoasEntity | null> {
    return this.repo.findOne({ where: { nmpessoa } });
  }

  // Busca todos os registros de Pessoas pelo campo sigla
  async findPessoasAllSigla(sigla: string): Promise<PessoasEntity[]> {
    return this.repo.find({ where: { sigla } });
  }
  
  // Busca um registro de Pessoa pelo campo sigla
  async findPessoasBySigla(sigla: string): Promise<PessoasEntity | null> {
    return this.repo.findOne({ where: { sigla } });
  }
}

