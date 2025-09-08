 
// C:\repository\proj-full-stack-backend\src\use-cases\pessoa\pessoas.repository.ts
import { DataSource, DeepPartial, Repository, FindOptionsWhere,  FindOptionsOrder } from 'typeorm';
import { PessoasEntity } from './pessoas.entity';
import type { PessoasCreate } from './pessoas.dto';

export class PessoasRepository {
  private repo: Repository<PessoasEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(PessoasEntity);
  }

  /** ✅ Cria a tabela 'pessoas' caso não exista */
  async createNotExistsPessoas(): Promise<void> {
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS pessoas (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(60) NOT NULL COLLATE utf8mb4_general_ci UNIQUE,
        sigla VARCHAR(5) NOT NULL,
        createdBy INT DEFAULT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedBy INT DEFAULT NULL,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  }

  /** Verifica duplicidade de registro em pessoas ou não  */
  async hasDuplicated(name?: string, sigla?: string, excludes: number[] = []) { 
    const query = this.repo.createQueryBuilder('pessoas')
    .select()
    .where('pessoas.nome LIKE :name', {name})
    .andWhere('pessoas.sigla LIKE :sigla', {sigla})
    
    // Excluir registros com mesmos nomes em pessoas
    if(!!excludes?.length) {
      query.andWhere('pessoas.id NOT IN(:...excludes)',{ excludes })
    }

    const result = await query.getOne()
    return result
  }

  /** ✅ método: cria a tabela física se não existir */
  async createIfNotExistsPessoas(): Promise<void> {
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS pessoas (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(60) NOT NULL COLLATE utf8mb4_general_ci UNIQUE,
        sigla TINYINT UNSIGNED NOT NULL DEFAULT 0,
        numberregs INT UNSIGNED DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedBy INT DEFAULT NULL,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  }


  
  // Cria novo registros em pessoas
  async createPessoas(pessoas: PessoasCreate): Promise<PessoasEntity> {
    const data = this.repo.create(pessoas);
    return this.repo.save(data);
  }

  // Altera registros em pessoas atraves do id selecionado
  async updatePessoas(pessoasId: number, pessoas: DeepPartial<PessoasEntity>): Promise<PessoasEntity> {
    const data = this.repo.create({ id: pessoasId, ...pessoas });
    return this.repo.save(data);
  }

  // Deleta registros em pessoas atraves do id selecionado
  async deletePessoas(pessoasId: number) {
    return this.repo.delete(pessoasId);
  }
  
  /////////////////////////////////
  
  // Busca todos os registros de Pessoas com condição opcional
  async findPessoasAll(
    where?: FindOptionsWhere<PessoasEntity>, 
    order?: FindOptionsOrder<PessoasEntity>): Promise<PessoasEntity[]> {
      return this.repo.find({ where, order });
  }
  
  // Busca um registro de pessoas pelo ID
  async findPessoasById(pessoasId: number): Promise<PessoasEntity | null> {
    if (!pessoasId || isNaN(pessoasId) || pessoasId <= 0) {
      throw new Error('Invalid pessoasId');
    }
    return this.repo.findOne({ where: { id: pessoasId } });
  }
  
  // Busca um registro de pessoas pelo ID?,nome?,sigla?
  async searchPessoas(params: { id?: number; nome?: string; sigla?: string }) {
    const query = this.repo.createQueryBuilder('pessoas')
      .select(['pessoas.id', 'pessoas.nome', 'pessoas.sigla'])
      .orderBy('pessoas.id', 'ASC'); // Ordenação padrão
  
    // Filtrar por ID (caso seja informado)
    if (params.id) {
      query.andWhere('pessoas.id = :id', { id: params.id });
    }
  
    // Filtrar por nmpessoa (caso seja informado)
    if (params.nome) {
      query.andWhere('pessoas.nome LIKE :nome', { nome: `%${params.nome}%` });
    }
  
    // Filtrar por sigla (caso seja informado)
    if (params.sigla) {
      query.andWhere('pessoas.sigla LIKE :sigla', { sigla: `%${params.sigla}%` });
    }
  
    return query.getMany();
  }
    
  // Busca todos os registros de Pessoas pelo campo nome
  async searchName(text?: string) {
    const query = this.repo.createQueryBuilder('Pessoas')
    .select(['Pessoas.id', 'Pessoas.nome'])
    .orderBy('Pessoas.id', 'ASC') // Ordena pelo ID de forma crescente
    .limit(100)
    if(!!text) query.andWhere('Pessoas.nome LIKE :text', { text: `%${text}%`})
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

  // Busca somente um registro de Pessoas pelo campo nome
  async findOneNomePessoas(nome: string): Promise<PessoasEntity | null> {
    return this.repo.findOne({ where: { nome } });
  }

  // Busca todos registros de Pessoas pelo campo nome
  async findAllNomePessoas(nome: string): Promise<PessoasEntity[]>  {
    return this.repo.find({ where: { nome } });
  }

  // Busca somente um registro de Pessoas pelo campo sigla
  async findOneSiglaPessoas(sigla: string): Promise<PessoasEntity | null> {
    return this.repo.findOne({ where: { sigla } });
  }

  // Busca todos registros de Pessoas pelo campo sigla
  async findAllSiglaPessoas(sigla: string): Promise<PessoasEntity[]> {
    return this.repo.find({ where: { sigla } });
  }
}
