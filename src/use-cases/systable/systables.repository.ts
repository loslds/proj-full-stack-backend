import { 
  DataSource, 
  DeepPartial, 
  Repository, 
  FindOptionsWhere, 
  FindOptionsOrder 
} from 'typeorm';

import { SystablesEntity } from './systables.entity';
import type { SystablesCreate } from './systables.dto';


export class SystablesRepository {
  private repo: Repository<SystablesEntity>;
  
  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(SystablesEntity);
  }

  /** Cria a tabela física se não existir */
  async createNotExistsSystables(): Promise<void> {
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS systables (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(60) NOT NULL COLLATE utf8mb4_general_ci UNIQUE,
        chkdb TINYINT UNSIGNED NOT NULL DEFAULT 0,
        numberregs INT UNSIGNED NOT NULL DEFAULT 0,
        createdBy INT UNSIGNED NOT NULL DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedBy INT UNSIGNED NOT NULL DEFAULT 0,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  }

  /** Verifica duplicidade */
  async hasDuplicated(
    nome?: string, 
    chkdb?: number, 
    numberregs?: number, 
    excludes: number[] = []
  ) {
    const query = this.repo.createQueryBuilder('systables')
      .select()
      .where('1 = 1');

    if (nome) query.andWhere('systables.nome = :nome', { nome });
    if (chkdb !== undefined) query.andWhere('systables.chkdb = :chkdb', { chkdb });
    if (numberregs !== undefined) query.andWhere('systables.numberregs = :numberregs', { numberregs });

    if (excludes.length) {
      query.andWhere('systables.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }

  /** Cria registros */
  async createSystables(systables: SystablesCreate): Promise<SystablesEntity> {
    const data = this.repo.create(systables);
    return this.repo.save(data);
  }

  /** Atualiza registros */
  async updateSystables(
    systablesId: number, 
    systables: DeepPartial<SystablesEntity>
  ): Promise<SystablesEntity> {
    if (!systablesId || isNaN(systablesId)) {
      throw new Error('Invalid systablesId');
    }

    const entity = await this.repo.preload({
      id: systablesId,
      ...systables,
    });

    if (!entity) {
      throw new Error(`systables com id ${systablesId} não encontrada`);
    }

    return this.repo.save(entity);
  }

  /** Deleta registros */
  async deleteSystables(systablesId: number): Promise<void> {
    const entity = await this.repo.findOne({ where: { id: systablesId } });

    if (!entity) throw new Error(`systables com id ${systablesId} não encontrada`);

    await this.repo.remove(entity);
  }

  /** Busca todos */
  async findSystablesAll(
    where?: FindOptionsWhere<SystablesEntity>,
    order?: FindOptionsOrder<SystablesEntity>
  ): Promise<SystablesEntity[]> {
    return this.repo.find({ where, order });
  }

  /** Busca pelo ID */
  async findSystablesById(systablesId: number): Promise<SystablesEntity | null> {
    if (!systablesId || isNaN(systablesId)) {
      throw new Error('Invalid systablesId');
    }
    return this.repo.findOne({ where: { id: systablesId } });
  }

  /** Busca geral */
  async searchSystables(params: { 
    id?: number; 
    nome?: string; 
    chkdb?: number; 
    numberregs?: number 
  }) {
    const query = this.repo.createQueryBuilder('systables')
      .select(['systables.id', 'systables.nome', 'systables.chkdb', 'systables.numberregs'])
      .orderBy('systables.id', 'ASC');

    if (params.id !== undefined) {
      query.andWhere('systables.id = :id', { id: params.id });
    }

    if (params.nome) {
      query.andWhere('systables.nome LIKE :nome', { nome: `%${params.nome}%` });
    }

    if (params.chkdb !== undefined) {
      query.andWhere('systables.chkdb = :chkdb', { chkdb: params.chkdb });
    }

    if (params.numberregs !== undefined) {
      query.andWhere('systables.numberregs = :numberregs', { numberregs: params.numberregs });
    }

    return query.getMany();
  }

  /** Busca por nome */
  async searchNomeSystables(text?: string) {
    const query = this.repo.createQueryBuilder('systables')
      .select(['systables.id', 'systables.nome', 'systables.chkdb', 'systables.numberregs'])
      .orderBy('systables.id', 'ASC')
      .limit(100);

    if (text) {
      query.andWhere('systables.nome LIKE :text', { text: `%${text}%` });
    }

    return query.getMany();
  }

  /** Busca por chkdb */
  async searchChkdbSystables(chkdb?: number) {
    const query = this.repo.createQueryBuilder('systables')
      .select(['systables.id', 'systables.nome', 'systables.chkdb', 'systables.numberregs'])
      .limit(100);

    if (chkdb !== undefined) {
      query.andWhere('systables.chkdb = :chkdb', { chkdb });
    }

    return query.getMany();
  }

  /** Busca por numberregs */
  async searchNumberregsSystables(num?: number) {
    const query = this.repo.createQueryBuilder('systables')
      .select(['systables.id', 'systables.nome', 'systables.chkdb', 'systables.numberregs'])
      .limit(100);

    if (num !== undefined) {
      query.andWhere('systables.numberregs = :num', { num });
    }

    return query.getMany();
  }

  /** Busca por nome exato */
  async findOneNomeSystables(nome: string): Promise<SystablesEntity | null> {
    return this.repo.findOne({ where: { nome } });
  }

  /** Lista id + nome */
  async findListNomeSystables() {
    return this.repo.createQueryBuilder('systables')
      .select(['systables.id', 'systables.nome'])
      .orderBy('systables.nome', 'ASC')
      .getRawMany();
  }

  /** Lista com filtro opcional por chkdb */
  async findListChkdbSystables(chkdb?: number) {
    const query = this.repo.createQueryBuilder('systables')
      .select(['systables.id', 'systables.nome', 'systables.chkdb'])
      .orderBy('systables.nome', 'ASC');

    if (chkdb !== undefined) {
      query.where('systables.chkdb = :chkdb', { chkdb });
    }

    return query.getRawMany();
  }

  /** Lista com filtro opcional por numberregs */
  async findListNumberregsSystables(numberregs?: number) {
    const query = this.repo.createQueryBuilder('systables')
      .select([
        'systables.id', 
        'systables.nome', 
        'systables.chkdb', 
        'systables.numberregs'
      ])
      .orderBy('systables.nome', 'ASC');

    if (numberregs !== undefined) {
      query.where('systables.numberregs = :numberregs', { numberregs });
    }

    return query.getRawMany();
  }
}
