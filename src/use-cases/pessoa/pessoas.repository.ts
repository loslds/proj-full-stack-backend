// src/use-cases/pessoa/pessoas.repository.ts
import { DataSource, DeepPartial, Repository, FindOptionsWhere, FindOptionsOrder } from 'typeorm';
import { PessoasEntity } from './pessoas.entity';
import type { PessoasCreate } from './pessoas.dto';
import { requiredPessoas } from '../../config/pessoas'

export class PessoasRepository {
  private repo: Repository<PessoasEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(PessoasEntity);
  }

  /** Cria a tabela 'pessoas' caso não exista */
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
  async hasDuplicated(
    nome?: string,
    fantasy?: string,
    id_pessoa?: number,
    excludes: number[] = []
  ) {
    const query = this.repo.createQueryBuilder('empresas');

    if (nome) {
      query.andWhere('empresas.nome = :nome', { nome });
    }
    if (fantasy) {
      query.andWhere('empresas.fantasy = :fantasy', { fantasy });
    }
  
    if (id_pessoa) {
      query.andWhere('empresas.id_pessoa = :id_pessoa', { id_pessoa });
    }

    if (excludes.length) {
      query.andWhere('empresas.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }

  async insertDefaultPessoas() {
    const batchSize = 500; // para não estourar limite do MySQL
    for (let i = 0; i < requiredPessoas.length; i += batchSize) {
      const batch = requiredPessoas.slice(i, i + batchSize);

      for (const pessoa of batch) {
        // 1️⃣ Verifica duplicidade
        const exists = await this.hasDuplicated(pessoa.nome, pessoa.sigla);
        
        if (exists) continue; // pula se já existir

        // 2️⃣ Insere o registro
        const entity = this.repo.create(pessoa);
        await this.repo.save(entity);
      }
    }

    console.log(`✅ Pessoas padrão inseridas com verificação de duplicidade`);
  }

//////////////////////////////////////////////

  /** Busca todos os registros de Pessoas */
  async findPessoasAll(
    where?: FindOptionsWhere<PessoasEntity>, 
    order?: FindOptionsOrder<PessoasEntity>
  ): Promise<PessoasEntity[]> {
    return this.repo.find({ where, order });
  }
  
  /** Cria novo registro em pessoas */
  async createPessoas(pessoas: PessoasCreate): Promise<PessoasEntity> {
    const data = this.repo.create(pessoas);
    return this.repo.save(data);
  }

  /** Busca registro de pessoas pelo ID */
  async findPessoasById(pessoasId: number): Promise<PessoasEntity | null> {
    if (!pessoasId || isNaN(pessoasId) || pessoasId <= 0) {
      throw new Error('Invalid pessoasId');
    }
    return this.repo.findOne({ where: { id: pessoasId } });
  }

  /** Atualiza registro em pessoas (seguro com preload) */
  async updatePessoas(
    pessoasId: number, 
    pessoas: DeepPartial<PessoasEntity>
    ): Promise<PessoasEntity> {
    if (!pessoasId || isNaN(pessoasId) || pessoasId <= 0) {
      throw new Error('Invalid pessoasId');
    }

    const entity = await this.repo.preload({ id: pessoasId, ...pessoas });
    if (!entity) {
      throw new Error(`Pessoa com id ${pessoasId} não encontrada`);
    }

    return this.repo.save(entity);
  }

  /** Deleta registro em pessoas */
  async deletePessoas(pessoasId: number): Promise<void> {
    const pessoas = await this.repo.findOne({ where: { id: pessoasId } });

    if (!pessoas) {
      throw new Error(`Pessoa com id ${pessoasId} não encontrada`);
    }

    await this.repo.remove(pessoas);
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
  async searchNamePessoas(text?: string) {
    const query = this.repo.createQueryBuilder('pessoas')
      .select(['pessoas.id', 'pessoas.nome', 'pessoas.sigla'])
      .orderBy('pessoas.id', 'ASC')
      .limit(100);
    if (text) query.andWhere('pessoas.nome LIKE :text', { text: `%${text}%` });
    return query.getMany();
  }

  /** Busca pela sigla */
  async searchSiglaPessoas(text?: string) {
    const query = this.repo.createQueryBuilder('pessoas')
      .select(['pessoas.id', 'pessoas.nome', 'pessoas.sigla'])
      .limit(100);
    if (text) query.andWhere('pessoas.sigla LIKE :text', { text: `%${text}%` });
    return query.getMany();
  }

  /** Busca um registro pelo nome */
  async findOneNomePessoas(nome: string): Promise<PessoasEntity | null> {
    return this.repo.findOne({ where: { nome } });
  }

  /** Busca todos registros pelo nome (igualdade exata, limitado a 100) */
  async findAllNomePessoas(nome: string): Promise<PessoasEntity[]> {
    return this.repo.find({
      where: { nome },
      take: 100,
      order: { id: "ASC" }
    });
  }

  /** Busca um registro pela sigla */
  async findOneSiglaPessoas(sigla: string): Promise<PessoasEntity | null> {
    return this.repo.findOne({ where: { sigla } });
  }

  /** Busca todos registros pelo nome (igualdade exata, limitado a 100) */
  async findAllSiglaPessoas(sigla: string): Promise<PessoasEntity[]> {
    return this.repo.find({
      where: { sigla },
      take: 100,
      order: { id: "ASC" }
    });
  }
}
