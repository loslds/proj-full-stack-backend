import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { Data_SysEntity } from './data_sys.entity';
import type { Data_SysCreate } from './data_sys.dto';

export class Data_SysRepository {
  private repo: Repository<Data_SysEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(Data_SysEntity);
  }

  async hasDuplicated(nome?: string, chkdb?: number, excludes: number[] = []) { 
    const query = this.repo.createQueryBuilder('Data_Sys')
    .select()
    .where('Data_Sys.nome LIKE : name', {nome})
    .andWhere('Data_Sys.chkdb LIKE : chkdb', {chkdb})

    if(!!excludes?.length) {
      query.andWhere('Data_Sys.id NOT IN(:...excludes)',{ excludes })
    }

    const result = await query.getOne()
    return result
  }

  async createData_sys(data_sys : Data_SysCreate): Promise<Data_SysEntity> {
    const data = this.repo.create(data_sys);
    return this.repo.save(data);
  }

  async updateData_sys(data_sysId: number, data_sys: DeepPartial<Data_SysEntity>): Promise<Data_SysEntity> {
    const data = this.repo.create({ id: data_sysId, ...data_sys });
    return this.repo.save(data);
  }

  async deleteDatasys(data_sysId: number) {
    return this.repo.delete(data_sysId);
  }
  
  /////////////////////////////////
  
  // Busca todos os registros de Data_Sys com condição opcional
  async findData_sysAll(where?: FindOptionsWhere<Data_SysEntity>): Promise<Data_SysEntity[]> {
    return this.repo.find({ where });
  }

  // Busca um registro de Data_sys pelo ID
  async findData_SysById(data_sysId: number): Promise<Data_SysEntity | null> {
    if (!data_sysId || isNaN(data_sysId) || data_sysId <= 0) {
      throw new Error('Invalid data_sysId');
    }
    return this.repo.findOne({ where: { id: data_sysId } });
  }
  
  async searchData_sys(params: { id?: number; nome?: string; chkdb?: number }) {
    const query = this.repo.createQueryBuilder('Data_sys')
      .select(['Data_sys.id', 'Data_sys.nome', 'Data_sys.chkdb'])
      .orderBy('Data_sys.id', 'ASC'); // Ordenação padrão
  
    // Filtrar por ID (caso seja informado)
    if (params.id) {
      query.andWhere('Data_sys.id = :id', { id: params.id });
    }
  
    // Filtrar por nome (caso seja informado)
    if (params.nome) {
      query.andWhere('Data_sys.nome LIKE : nome', { nome: `%${params.nome}%` });
    }
  
    // Filtrar por chkdb (caso seja informado)
    if (params.chkdb) {
      query.andWhere('Data_sys.chkdb LIKE : chkdb', { chkdb: `%${params.chkdb}%` });
    }
  
    return query.getMany();
  }
  
  // Busca todos os registros de Data_sys pelo campo nome
  async searchName(text?: string) {
    const query = this.repo.createQueryBuilder('Data_sys')
    .select(['Data_sys.id', 'Data_sys.nome'])
    .orderBy('Data_sys.id', 'ASC') // Ordena pelo ID de forma crescente
    .limit(100)
    if(!!text) query.andWhere('Data_sys.nome LIKE : text', { text: `%${text}%`})
    return query.getMany()
  }
  
  // Busca todos os registros de Data_sys pelo campo chkdb
  async searchChkbd(text?: string) {
    const query = this.repo.createQueryBuilder('Data_sys')
    .select(['Data_sys.id', 'Data_sys.chkdb'])
    .limit(100)
    if(!!text) query.andWhere('Data_sys.chkdb LIKE : text', { text: `%${text}%`})
    return query.getMany()
  }

  // Busca um registro de Data_sys pelo campo nome
  async findData_sysByNome(nome: string): Promise<Data_SysEntity | null> {
    return this.repo.findOne({ where: { nome } });
  }

  // Busca todos os registros de Data_sys pelo campo chkdb
  async findDatasysAllChkdb(chkdb: number): Promise<Data_SysEntity[]> {
     return this.repo.find({ where: { chkdb } });
  }
}

