
//C:\repository\proj-full-stack-backend\src\use-cases\systable\systables.repository.ts
import { dbSource } from '../../database';
import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
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
  async createSystable(systables : SystablesCreate): Promise<SystablesEntity> {
    const data = this.repo.create(systables);
    return this.repo.save(data);
  }

  // Altera registros em systables atraves do id selecionado
  async updateSystable(systablesId: number, systables: DeepPartial<SystablesEntity>): Promise<SystablesEntity> {
    const data = this.repo.create({ id: systablesId, ...systables });
    return this.repo.save(data);
  }
  
  // Deleta registros em systables atraves do id selecionado
  async deleteSystable(systablesId: number) {
    return this.repo.delete(systablesId);
  }
  
  /////////////////////////////////
  
  // Busca todos os registros de systables com condição opcional
  async findSystableAll(where?: FindOptionsWhere<SystablesEntity>): Promise<SystablesEntity[]> {
    return this.repo.find({ where });
  }

  // Busca um registro de systables pelo ID
  async findSystableById(systablesId: number): Promise<SystablesEntity | null> {
    if (!systablesId || isNaN(systablesId) || systablesId <= 0) {
      throw new Error('Invalid systablesId');
    }
    return this.repo.findOne({ where: { id: systablesId } });
  }
  
  // Busca um registro de systables pelo ID?,nome?,sigla?
  async searchSystable(params: { id?: number; nome?: string; chkdb?: number; numberregs?: number }) {
    const query = this.repo.createQueryBuilder('systables')
      .select(['systables.id', 'systables.nome', 'systables.chkdb', 'systables.numberregs'])
      .orderBy('systables.id', 'ASC'); // Ordenação padrão
  
    // Filtrar por ID (caso seja informado)
    if (params.id) {
      query.andWhere('systables.id = :id', { id: params.id });
    }
  
    // Filtrar por nome (caso seja informado)
    if (params.nome) {
      query.andWhere('systables.nome LIKE : nome', { nome: `%${params.nome}%` });
    }
  
    // Filtrar por chkdb (caso seja informado)
    if (params.chkdb) {
      query.andWhere('systables.chkdb LIKE : chkdb', { chkdb: `%${params.chkdb}%` });
    }

    // Filtrar por numberregs (caso seja informado)
    if (params.numberregs) {
      query.andWhere('systables.numberregs LIKE : numberregs', { numberregs: `%${params.numberregs}%` });
    }
    
    return query.getMany();
  }
  
  // Busca todos os registros de systables pelo campo nome
  async searchName(text?: string) {
    const query = this.repo.createQueryBuilder('systables')
    .select(['systable.id', 'systable.nome', 'systables.chkdb', 'systables.numberregs'])
    .orderBy('systable.id', 'ASC') // Ordena pelo ID de forma crescente
    .limit(100)
    if(!!text) query.andWhere('systable.nome LIKE : text', { text: `%${text}%`})
    return query.getMany()
  }
  
  // Busca todos os registros de systables pelo campo chkdb
  async searchChkbd(text?: string) {
    const query = this.repo.createQueryBuilder('systables')
    .select(['systables.id', 'systables.name', 'systables.chkdb', 'systables.numberregs'])
    .limit(100)
    if(!!text) query.andWhere('systables.chkdb LIKE : text', { text: `%${text}%`})
    return query.getMany()
  }

  // Busca um registro de systables pelo campo nome
  async findOneNomeSystable(nome: string): Promise<SystablesEntity | null> {
    return this.repo.findOne({ where: { nome } });
  }

  // Busca todos registros de systables pelo campo nome
  async findAllNomeSystables(nome: string): Promise<SystablesEntity[]>  {
    return this.repo.find({ where: { nome } });
  }

  // Busca todos registros de systables pelo campo chkdb
  async findAllChkdbSystables(chkdb: number): Promise<SystablesEntity[]> {
    return this.repo.find({ where: { chkdb } });
  }
  
  // Busca todos registros de systables pelo campo numberregs
  async findAllNumberRegSystables( numberregs: number ): Promise<SystablesEntity[]> {
    return this.repo.find({ where: { numberregs } });
  }
}  

// // Busca somente um registro de systables pelo campo chkdb
  //   async findOneChkdbSystables(chkdb: number): Promise<SystablesEntity | null> {
  //     return this.repo.findOne({ where: { chkdb } });
  //   }
  
  // // Busca somente um registro de systables pelo campo numberregs
  //   async findOneNumberregsSystables(numberregs: number): Promise<SystablesEntity | null> {
  //     return this.repo.findOne({ where: { numberregs } });
  //   }



 
