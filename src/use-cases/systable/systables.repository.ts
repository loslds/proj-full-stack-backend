import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { SystablesEntity } from './systables.entity';
import type { SystablesCreate } from './systables.dto';


export class SystablesRepository {
  private repo: Repository<SystablesEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(SystablesEntity);
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

  async createSystable(systables : SystablesCreate): Promise<SystablesEntity> {
    const data = this.repo.create(systables);
    return this.repo.save(data);
  }

  async updateSystable(systablesId: number, systables: DeepPartial<SystablesEntity>): Promise<SystablesEntity> {
    const data = this.repo.create({ id: systablesId, ...systables });
    return this.repo.save(data);
  }

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
      throw new Error('Invalid data_sysId');
    }
    return this.repo.findOne({ where: { id: systablesId } });
  }
  
  async searchSystable(params: { id?: number; nome?: string; chkdb?: number; numberregs?: number }) {
    const query = this.repo.createQueryBuilder('systables')
      .select(['systables.id', 'systables.nome'])
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
    .select(['systable.id', 'systable.nome'])
    .orderBy('systable.id', 'ASC') // Ordena pelo ID de forma crescente
    .limit(100)
    if(!!text) query.andWhere('systable.nome LIKE : text', { text: `%${text}%`})
    return query.getMany()
  }
  
  // Busca todos os registros de systables pelo campo chkdb
  async searchChkbd(text?: string) {
    const query = this.repo.createQueryBuilder('systables')
    .select(['systables.id', 'systables.chkdb'])
    .limit(100)
    if(!!text) query.andWhere('systables.chkdb LIKE : text', { text: `%${text}%`})
    return query.getMany()
  }

  // Busca um registro de systables pelo campo nome
  async findSystableByNome(nome: string): Promise<SystablesEntity | null> {
    return this.repo.findOne({ where: { nome } });
  }

  // Busca todos os registros de systables pelo campo chkdb
  async findSystableAllChkdb(chkdb: number): Promise<SystablesEntity[]> {
     return this.repo.find({ where: { chkdb } });
  }


}

