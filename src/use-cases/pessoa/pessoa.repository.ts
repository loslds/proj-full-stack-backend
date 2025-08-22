import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { PessoasEntity } from './pessoa.entity';
import type { PessoasCreate } from './pessoa.dto';

export class PessoasRepository {
  private repo: Repository<PessoasEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(PessoasEntity);
  }

  async hasDuplicated(name?: string, sigla?: string, excludes: number[] = []) { 
    const query = this.repo.createQueryBuilder('Pessoas')
    .select()
    .where('Pessoas.nmpessoa LIKE :name', {name})
    .andWhere('Pessoas.sigla LIKE :sigla', {sigla})

    if(!!excludes?.length) {
      query.andWhere('Pessoas.id NOT IN(:...excludes)',{ excludes })
    }

    const result = await query.getOne()
    return result
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
  async findPessoasAll(where?: FindOptionsWhere<PessoasEntity>): Promise<PessoasEntity[]> {
    return this.repo.find({ where });
  }

  // Busca um registro de Pessoas pelo ID
  async findPessoasById(pessoasId: number): Promise<PessoasEntity | null> {
    if (!pessoasId || isNaN(pessoasId) || pessoasId <= 0) {
      throw new Error('Invalid pessoasId');
    }
    return this.repo.findOne({ where: { id: pessoasId } });
  }
  
  async searchpessoas(params: { id?: number; nmpessoa?: string; sigla?: string }) {
    const query = this.repo.createQueryBuilder('Pessoas')
      .select(['Pessoas.id', 'Pessoas.nmpessoa', 'Pessoas.sigla'])
      .orderBy('Pessoas.id', 'ASC'); // Ordenação padrão
  
    // Filtrar por ID (caso seja informado)
    if (params.id) {
      query.andWhere('Pessoas.id = :id', { id: params.id });
    }
  
    // Filtrar por nmpessoa (caso seja informado)
    if (params.nmpessoa) {
      query.andWhere('Pessoas.nmpessoa LIKE :nmpessoa', { nmpessoa: `%${params.nmpessoa}%` });
    }
  
    // Filtrar por sigla (caso seja informado)
    if (params.sigla) {
      query.andWhere('Pessoas.sigla LIKE :sigla', { sigla: `%${params.sigla}%` });
    }
  
    return query.getMany();
  }
  

  
  
  // Busca todos os registros de Pessoas pelo campo nmpessoa
  async searchName(text?: string) {
    const query = this.repo.createQueryBuilder('Pessoas')
    .select(['Pessoas.id', 'Pessoas.nmpessoa'])
    .orderBy('Pessoas.id', 'ASC') // Ordena pelo ID de forma crescente
    .limit(100)
    if(!!text) query.andWhere('Pessoas.nmpessoa LIKE :text', { text: `%${text}%`})
    return query.getMany()
  }
  
  // Busca todos os registros de Pessoas pelo campo sigla
  async searchSigla(text?: string) {
    const query = this.repo.createQueryBuilder('Pessoas')
    .select(['Pessoas.id', 'Pessoas.sigla'])
    .limit(100)
    if(!!text) query.andWhere('Pessoas.sigla LIKE :text', { text: `%${text}%`})
    return query.getMany()
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

