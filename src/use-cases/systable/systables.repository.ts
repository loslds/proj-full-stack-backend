
//C:\repository\proj-full-stack-backend\src\use-cases\systable\systables.repository.ts
import { DataSource, DeepPartial, Repository, FindOptionsWhere, FindOptionsOrder } from 'typeorm';
import { SystablesEntity } from './systables.entity';
import type { SystablesCreate } from './systables.dto';


export class SystablesRepository {
  private repo: Repository<SystablesEntity>;
  
  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(SystablesEntity);
  }

  /** ✅ método: cria a tabela física se não existir */
  async createNotExistsSystables(): Promise<void> {
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS systables (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(60) NOT NULL COLLATE utf8mb4_general_ci UNIQUE,
        chkdb TINYINT UNSIGNED NOT NULL DEFAULT 0,
        numberregs INT UNSIGNED DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedBy INT DEFAULT NULL,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  }

  async hasDuplicated(nome?: string, chkdb?: number, numberregs?: number, excludes: number[] = []) { 
    const query = this.repo.createQueryBuilder('systables')
    .select()
    .where('systables.nome LIKE : name', {nome})
    .andWhere('systables.chkdb LIKE : chkdb', {chkdb})
    .andWhere('systables.numberregs LIKE : numberregs', {numberregs})

    if(!!excludes?.length) {
      query.andWhere('systables.id NOT IN(:...excludes)',{ excludes })
    }

    const result = await query.getOne()
    return result
  }

  // Cria novo registros em systables
  async createSystables(systables : SystablesCreate): Promise<SystablesEntity> {
    const data = this.repo.create(systables);
    return this.repo.save(data);
  }
 
  // Altera registros em systables atraves do id selecionado
  async updateSystables(
    systablesId: number, 
    systables: DeepPartial<SystablesEntity>
  ): Promise<SystablesEntity> {
    if (!systablesId || isNaN(systablesId) || systablesId <= 0) {
      throw new Error('Invalid systablesId');
    }

    const entity = await this.repo.preload({ id: systablesId, ...systables });
    if (!entity) {
      throw new Error(`systables com id ${systablesId} não encontrada`);
    }

    return this.repo.save(entity);
  }

    
  // Deleta registros em systables atraves do id selecionado
  async deleteSystables(systablesId: number): Promise<void> {
    const entity = await this.repo.findOne({ where: { id: systablesId } });
    if (!entity) throw new Error(`systables com id ${systablesId} não encontrada`);
    await this.repo.remove(entity);
  }

   ///////////////////////////////////////////////
  // Busca todos os registros de systables 
  async findSystablesAll(
    where?: FindOptionsWhere<SystablesEntity>,
    order?: FindOptionsOrder<SystablesEntity>
  ): Promise<SystablesEntity[]> {
    return this.repo.find({ where, order });
  }

  // Busca um registro de systables pelo ID
  async findSystablesById(systablesId: number): Promise<SystablesEntity | null> {
    if (!systablesId || isNaN(systablesId) || systablesId <= 0) {
      throw new Error('Invalid systablesId');
    }
    return this.repo.findOne({ where: { id: systablesId } });
  }
  
  // Busca um registro de systables pelo ID?,nome?,sigla?
  async searchSystables(params: { id?: number; nome?: string; chkdb?: number; numberregs?: number }) {
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

  // Busca todos os registros de systables pelo campo nome
  async searchNameSystables(text?: string) {
    const query = this.repo.createQueryBuilder('systables')
    .select(['systable.id', 'systable.nome', 'systables.chkdb', 'systables.numberregs'])
    .orderBy('systable.id', 'ASC') // Ordena pelo ID de forma crescente
    .limit(100)
    if(!!text) query.andWhere('systable.nome LIKE : text', { text: `%${text}%`})
    return query.getMany()
  }
  
  // Busca todos os registros de systables pelo campo chkdb
  async searchChkdbSystables(text?: string) {
    const query = this.repo.createQueryBuilder('systables')
    .select(['systables.id', 'systables.name', 'systables.chkdb', 'systables.numberregs'])
    .limit(100)
    if(!!text) query.andWhere('systables.chkdb LIKE : text', { text: `%${text}%`})
    return query.getMany()
  }

  // Busca todos os registros de systables pelo campo numberregs
  async searchNumberregsSystables(text?: string) {
    const query = this.repo.createQueryBuilder('systables')
    .select(['systables.id', 'systables.name', 'systables.chkdb', 'systables.numberregs'])
    .limit(100)
    if(!!text) query.andWhere('systables.numberregs LIKE : text', { text: `%${text}%`})
    return query.getMany()
  }


  // Busca um registro de systables pelo campo nome
  async findOneNomeSystables(nome: string): Promise<SystablesEntity | null> {
    return this.repo.findOne({ where: { nome } });
  }


  
  /** Retorna lista de todos os id e nome de systables */
  async findListNomeSystables(): Promise<{ id: number; nome: string }[]> {
    return this.repo
      .createQueryBuilder('systables')
      .select(['systables.id', 'systables.nome'])
      .orderBy('systables.nome', 'ASC') // opcional, ordena por nome
      .getRawMany(); // retorna um array de objetos { id, nome }
  }

  /** Retorna lista de id, nome e chkdb de systables, opcionalmente filtrando por chkdb */
  async findListNomeChkdbSystables(chkdb?: number): Promise<{ id: number; nome: string; chkdb: number }[]> {
    const query = this.repo
      .createQueryBuilder('systables')
      .select(['systables.id', 'systables.nome', 'systables.chkdb'])
      .orderBy('systables.nome', 'ASC');

    if (chkdb !== undefined) {
      query.where('systables.chkdb = :chkdb', { chkdb });
    }

    return query.getRawMany(); // retorna array de objetos { id, nome, chkdb }
  }
 
  /** Retorna lista de id, nome, chkdb e numberregs de systables, opcionalmente filtrando por numberregs */
  async findListNomeNumberregsSystables(
    numberregs?: number
  ): Promise<{ id: number; nome: string; chkdb: number; numberregs: number }[]> {
    const query = this.repo
      .createQueryBuilder('systables')
      .select(['systables.id', 'systables.nome', 'systables.chkdb', 'systables.numberregs'])
      .orderBy('systables.nome', 'ASC');

    if (numberregs !== undefined) {
      query.where('systables.numberregs = :numberregs', { numberregs });
    }
    return query.getRawMany(); // retorna array de objetos { id, nome, chkdb, numberregs }
  }
}
