// src/use-cases/pessoa/pessoas.repository.ts
import { DataSource, DeepPartial, Repository, FindOptionsWhere, FindOptionsOrder } from 'typeorm';
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
        createdBy INT UNSIGNED DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedBy INT UNSIGNED DEFAULT 0,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  }

  /** Verifica duplicidade de registro em pessoas */
  async hasDuplicated(name?: string, sigla?: string, excludes: number[] = []) { 
    const query = this.repo.createQueryBuilder('pessoas')
      .select()
      .where('pessoas.nome LIKE :name', { name })
      .andWhere('pessoas.sigla LIKE :sigla', { sigla });

    if (excludes.length) {
      query.andWhere('pessoas.id NOT IN(:...excludes)', { excludes });
    }

    return query.getOne();
  }

  /** Insere registros padrão de Pessoas */
  async insertDefaultPessoas(): Promise<void> {
    const defaults: PessoasCreate[] = [
      { nome: 'Pessoa Física', sigla: 'PF', createdBy: 0, updatedBy: 0 },
      { nome: 'Pessoa Jurídica', sigla: 'PJ', createdBy: 0, updatedBy: 0 }
    ];

    for (const pessoa of defaults) {
      const exists = await this.hasDuplicated(pessoa.nome, pessoa.sigla);
      if (!exists) {
        await this.createPessoas(pessoa);
      }
    }
  }

  /** Cria novo registro em pessoas */
  async createPessoas(pessoas: PessoasCreate): Promise<PessoasEntity> {
    const data = this.repo.create(pessoas);
    return this.repo.save(data);
  }

  /** Atualiza registro em pessoas */
  async updatePessoas(pessoasId: number, pessoas: DeepPartial<PessoasEntity>): Promise<PessoasEntity> {
    const data = this.repo.create({ id: pessoasId, ...pessoas });
    return this.repo.save(data);
  }

  /** Deleta registro em pessoas */
  async deletePessoas(pessoasId: number) {
    return this.repo.delete(pessoasId);
  }

  /** Busca todos os registros de Pessoas */
  async findPessoasAll(
    where?: FindOptionsWhere<PessoasEntity>, 
    order?: FindOptionsOrder<PessoasEntity>
  ): Promise<PessoasEntity[]> {
    return this.repo.find({ where, order });
  }

  /** Busca registro de pessoas pelo ID */
  async findPessoasById(pessoasId: number): Promise<PessoasEntity | null> {
    if (!pessoasId || isNaN(pessoasId) || pessoasId <= 0) {
      throw new Error('Invalid pessoasId');
    }
    return this.repo.findOne({ where: { id: pessoasId } });
  }

  /** Busca por ID, nome ou sigla */
  async searchPessoas(params: { id?: number; nome?: string; sigla?: string }) {
    const query = this.repo.createQueryBuilder('pessoas')
      .select(['pessoas.id', 'pessoas.nome', 'pessoas.sigla'])
      .orderBy('pessoas.id', 'ASC');

    if (params.id) query.andWhere('pessoas.id = :id', { id: params.id });
    if (params.nome) query.andWhere('pessoas.nome LIKE :nome', { nome: `%${params.nome}%` });
    if (params.sigla) query.andWhere('pessoas.sigla LIKE :sigla', { sigla: `%${params.sigla}%` });

    return query.getMany();
  }

  /** Busca pelo nome */
  async searchName(text?: string) {
    const query = this.repo.createQueryBuilder('pessoas')
      .select(['pessoas.id', 'pessoas.nome'])
      .orderBy('pessoas.id', 'ASC')
      .limit(100);
    if (text) query.andWhere('pessoas.nome LIKE :text', { text: `%${text}%` });
    return query.getMany();
  }

  /** Busca pela sigla */
  async searchSigla(text?: string) {
    const query = this.repo.createQueryBuilder('pessoas')
      .select(['pessoas.id', 'pessoas.sigla'])
      .limit(100);
    if (text) query.andWhere('pessoas.sigla LIKE :text', { text: `%${text}%` });
    return query.getMany();
  }

  /** Busca um registro pelo nome */
  async findOneNomePessoas(nome: string): Promise<PessoasEntity | null> {
    return this.repo.findOne({ where: { nome } });
  }

  /** Busca todos registros pelo nome */
  async findAllNomePessoas(nome: string): Promise<PessoasEntity[]> {
    return this.repo.find({ where: { nome } });
  }

  /** Busca um registro pela sigla */
  async findOneSiglaPessoas(sigla: string): Promise<PessoasEntity | null> {
    return this.repo.findOne({ where: { sigla } });
  }

  /** Busca todos registros pela sigla */
  async findAllSiglaPessoas(sigla: string): Promise<PessoasEntity[]> {
    return this.repo.find({ where: { sigla } });
  }
}
