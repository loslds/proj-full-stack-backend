 
// src/use-cases/pessoa/pessoas.repository.ts
import { 
  DataSource, 
  DeepPartial, 
  Repository, 
  FindOptionsWhere, 
  FindOptionsOrder 
} from 'typeorm';

import { PessoasEntity } from './pessoas.entity';
import type { PessoasCreate } from './pessoas.dto';
import { requiredPessoas } from '../../config/pessoas';

export class PessoasRepository {
  private repo: Repository<PessoasEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(PessoasEntity);
  }

  // ============================================================
  // * CRIAÇÃO DA TABELA *
  // ============================================================

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

  // ============================================================
  // * DUPLICIDADE *
  // ============================================================

  async hasDuplicated(
    nome?: string,
    sigla?: string,
    excludeId?: number
  ): Promise<boolean> {
    const query = this.repo.createQueryBuilder('pessoas')
      .select(['pessoas.id']);

    if (nome) query.andWhere('pessoas.nome = :nome', { nome });
    if (sigla) query.andWhere('pessoas.sigla = :sigla', { sigla });
    if (excludeId)
      query.andWhere('pessoas.id != :excludeId', { excludeId });

    const result = await query.getOne();
    return !!result;
  }

  // ============================================================
  // * INSERÇÃO DEFAULT *
  // ============================================================

  async insertDefaultPessoas() {
    const batchSize = 150;

    for (let i = 0; i < requiredPessoas.length; i += batchSize) {
      const batch = requiredPessoas.slice(i, i + batchSize);

      for (const pessoa of batch) {
        const exists = await this.hasDuplicated(pessoa.nome, pessoa.sigla);
        if (exists) continue;

        await this.repo.save(this.repo.create(pessoa));
      }
    }

    console.log(`✅ Pessoas padrão inseridas (verificação incluída)`);
  }

  // ============================================================
  // * CRUD *
  // ============================================================

  async findPessoasAll(
    where?: FindOptionsWhere<PessoasEntity>,
    order?: FindOptionsOrder<PessoasEntity>
  ): Promise<PessoasEntity[]> {
    return this.repo.find({ where, order });
  }

  async createPessoas(pessoas: PessoasCreate): Promise<PessoasEntity> {
    const entity = this.repo.create(pessoas);
    return this.repo.save(entity);
  }

  async findPessoasById(pessoasId: number): Promise<PessoasEntity | null> {
    this.validateId(pessoasId);
    return this.repo.findOne({ where: { id: pessoasId } });
  }

  async updatePessoas(
    pessoasId: number,
    pessoas: DeepPartial<PessoasEntity>
  ): Promise<PessoasEntity> {
    this.validateId(pessoasId);

    const entity = await this.repo.preload({ id: pessoasId, ...pessoas });
    if (!entity) {
      throw new Error(`Pessoa com id ${pessoasId} não encontrada`);
    }

    return this.repo.save(entity);
  }

  async deletePessoas(pessoasId: number): Promise<void> {
    this.validateId(pessoasId);

    const found = await this.repo.findOne({ where: { id: pessoasId } });
    if (!found) {
      throw new Error(`Pessoa com id ${pessoasId} não encontrada`);
    }

    await this.repo.remove(found);
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================

  async searchPessoas(params: { id?: number; nome?: string; sigla?: string }) {
    const query = this.repo.createQueryBuilder('pessoas')
      .select(['pessoas.id', 'pessoas.nome', 'pessoas.sigla'])
      .orderBy('pessoas.id', 'ASC');

    if (params.id) query.andWhere('pessoas.id = :id', { id: params.id });
    if (params.nome)
      query.andWhere('pessoas.nome LIKE :nome COLLATE utf8mb4_general_ci', {
        nome: `%${params.nome}%`
      });
    if (params.sigla)
      query.andWhere('pessoas.sigla LIKE :sigla COLLATE utf8mb4_general_ci', {
        sigla: `%${params.sigla}%`
      });

    return query.getMany();
  }

  async searchNomePessoas(text?: string) {
    const query = this.repo.createQueryBuilder('pessoas')
      .select(['pessoas.id', 'pessoas.nome', 'pessoas.sigla'])
      .orderBy('pessoas.id', 'ASC')
      .limit(100);

    if (text)
      query.andWhere('pessoas.nome LIKE :text COLLATE utf8mb4_general_ci', {
        text: `%${text}%`
      });

    return query.getMany();
  }

  async searchSiglaPessoas(text?: string) {
    const query = this.repo.createQueryBuilder('pessoas')
      .select(['pessoas.id', 'pessoas.nome', 'pessoas.sigla'])
      .orderBy('pessoas.id', 'ASC')
      .limit(100);

    if (text)
      query.andWhere('pessoas.sigla LIKE :text COLLATE utf8mb4_general_ci', {
        text: `%${text}%`
      });

    return query.getMany();
  }

  async findOneNomePessoas(nome: string) {
    return this.repo.findOne({ where: { nome } });
  }

  async findAllNomePessoas(nome: string) {
    return this.repo.find({
      where: { nome },
      order: { id: 'ASC' },
      take: 100
    });
  }

  async findOneSiglaPessoas(sigla: string) {
    return this.repo.findOne({ where: { sigla } });
  }

  async findAllSiglaPessoas(sigla: string) {
    return this.repo.find({
      where: { sigla },
      order: { id: 'ASC' },
      take: 100
    });
  }

  // ============================================================
  // * UTIL *
  // ============================================================

  private validateId(id: number) {
    if (!id || isNaN(id) || id <= 0) {
      throw new Error('Invalid pessoasId');
    }
  }
}
