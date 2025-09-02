import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { SystablesEntity } from './systable.entity';
import type { SystableCreate } from './systable.dto';

export class SystableRepository {
  private repo: Repository<SystablesEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(SystablesEntity);
  }

  async hasDuplicated(nome?: string, chkdb?: number, excludes: number[] = []) { 
    const query = this.repo.createQueryBuilder('systable')
    .select()
    .where('systable.nome LIKE : name', {nome})
    .andWhere('systable.chkdb LIKE : chkdb', {chkdb})

    if(!!excludes?.length) {
      query.andWhere('systable.id NOT IN(:...excludes)',{ excludes })
    }

    const result = await query.getOne()
    return result
  }

  async createSystable(systable : SystableCreate): Promise<SystablesEntity> {
    const data = this.repo.create(systable);
    return this.repo.save(data);
  }

  async updateSystable(systableId: number, systable: DeepPartial<SystablesEntity>): Promise<SystablesEntity> {
    const data = this.repo.create({ id: systableId, ...systable });
    return this.repo.save(data);
  }

  async deleteSystable(systableId: number) {
    return this.repo.delete(systableId);
  }
  
  /////////////////////////////////
  
  // Busca todos os registros de Data_Sys com condição opcional
  async findSystableAll(where?: FindOptionsWhere<SystablesEntity>): Promise<SystablesEntity[]> {
    return this.repo.find({ where });
  }

  // Busca um registro de Data_sys pelo ID
  async findSystableById(systableId: number): Promise<SystablesEntity | null> {
    if (!systableId || isNaN(systableId) || systableId <= 0) {
      throw new Error('Invalid data_sysId');
    }
    return this.repo.findOne({ where: { id: systableId } });
  }
  
  async searchSystable(params: { id?: number; nome?: string; chkdb?: number }) {
    const query = this.repo.createQueryBuilder('systable')
      .select(['systable.id', 'systable.nome', 'systable.chkdb'])
      .orderBy('systable.id', 'ASC'); // Ordenação padrão
  
    // Filtrar por ID (caso seja informado)
    if (params.id) {
      query.andWhere('systable.id = :id', { id: params.id });
    }
  
    // Filtrar por nome (caso seja informado)
    if (params.nome) {
      query.andWhere('systable.nome LIKE : nome', { nome: `%${params.nome}%` });
    }
  
    // Filtrar por chkdb (caso seja informado)
    if (params.chkdb) {
      query.andWhere('systable.chkdb LIKE : chkdb', { chkdb: `%${params.chkdb}%` });
    }
  
    return query.getMany();
  }
  
  // Busca todos os registros de Data_sys pelo campo nome
  async searchName(text?: string) {
    const query = this.repo.createQueryBuilder('systable')
    .select(['systable.id', 'systable.nome'])
    .orderBy('systable.id', 'ASC') // Ordena pelo ID de forma crescente
    .limit(100)
    if(!!text) query.andWhere('systable.nome LIKE : text', { text: `%${text}%`})
    return query.getMany()
  }
  
  // Busca todos os registros de Data_sys pelo campo chkdb
  async searchChkbd(text?: string) {
    const query = this.repo.createQueryBuilder('systable')
    .select(['systable.id', 'systable.chkdb'])
    .limit(100)
    if(!!text) query.andWhere('systable.chkdb LIKE : text', { text: `%${text}%`})
    return query.getMany()
  }

  // Busca um registro de Data_sys pelo campo nome
  async findSystableByNome(nome: string): Promise<SystablesEntity | null> {
    return this.repo.findOne({ where: { nome } });
  }

  // Busca todos os registros de Data_sys pelo campo chkdb
  async findSystableAllChkdb(chkdb: number): Promise<SystablesEntity[]> {
     return this.repo.find({ where: { chkdb } });
  }
}

