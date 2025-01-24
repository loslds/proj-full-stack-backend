import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { PessoaEntity } from './pessoa.entity';
import type { PessoaCreate } from './pessoa.dto';

export class PessoaRepository {
  private repo: Repository<PessoaEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(PessoaEntity);
  }

  async createPessoa(pessoa: PessoaCreate): Promise<PessoaEntity> {
    const data = this.repo.create(pessoa);
    return this.repo.save(data);
  }

  async updatePessoa(pessoaId: number, pessoa: DeepPartial<PessoaEntity>): Promise<PessoaEntity> {
    const data = this.repo.create({ id: pessoaId, ...pessoa });
    return this.repo.save(data);
  }

  async deletePessoa(pessoaId: number) {
    return this.repo.delete(pessoaId);
  }
  
  /////////////////////////////////
  
  // Busca todos os registros de Pessoa com condição opcional
  async findPessoalAll(where?: FindOptionsWhere<PessoaEntity>): Promise<PessoaEntity[]> {
    return this.repo.find({ where });
  }

  // Busca um registro de Pessoa pelo ID
  async findPessoaById(pessoaId: number): Promise<PessoaEntity | null> {
    if (!pessoaId || isNaN(pessoaId) || pessoaId <= 0) {
      throw new Error('Invalid pessoaId');
    }
    return this.repo.findOne({ where: { id: pessoaId } });
  }


  // Busca todos os registros de Pessoa pelo campo nmpessoa
  async findPessoaAllNmpessoa(nmpessoa: string): Promise<PessoaEntity[]> {
    return this.repo.find({ where: { nmpessoa } });
  }
  
  // Busca um registro de Pessoa pelo campo nmpessoa
  async findPessoaByNmpessoa(nmpessoa: string): Promise<PessoaEntity | null> {
    return this.repo.findOne({ where: { nmpessoa } });
  }

  // Busca todos os registros de Pessoa pelo campo sigla
  async findPessoaAllSigla(sigla: string): Promise<PessoaEntity[]> {
    return this.repo.find({ where: { sigla } });
  }
  
  // Busca um registro de Pessoa pelo campo sigla
  async findPessoaBySigla(sigla: string): Promise<PessoaEntity | null> {
    return this.repo.findOne({ where: { sigla } });
  }
}

