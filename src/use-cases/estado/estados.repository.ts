// C:\repository\proj-full-stack-backend\src\use-cases\estado\estados.repository.ts

import { DataSource, DeepPartial, Repository, FindOptionsWhere, FindOptionsOrder } from 'typeorm';
import { EstadosEntity } from './estados.entity';
import type { EstadosCreate } from './estados.dto';
import { requiredEstados } from '../../config/estados'

export class EstadosRepository {
  private repo: Repository<EstadosEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(EstadosEntity);
  }

  /** Cria a tabela 'estados' caso não exista */
  async createNotExistsEstados(): Promise<void> {
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS estados (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(60) NOT NULL COLLATE utf8mb4_general_ci UNIQUE,
        uf VARCHAR(5) NOT NULL,
        createdBy INT UNSIGNED DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedBy INT UNSIGNED DEFAULT 0,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  }

  /** Verifica duplicidade de registro */
  async hasDuplicated(name?: string, uf?: string, excludes: number[] = []) { 
    const query = this.repo.createQueryBuilder('estados')
      .select()
      .where('estados.nome LIKE :name', { name })
      .andWhere('estados.uf LIKE :uf', { uf });

    if (excludes.length) {
      query.andWhere('estados.id NOT IN(:...excludes)', { excludes });
    }

    return query.getOne();
  }

  async insertDefaultEstados(): Promise<void> {
    
    for (const estados of requiredEstados) {
      const exists = await this.hasDuplicated(estados.nome, estados.uf);
      if (!exists) {
        await this.createEstados(estados);
      }
    }
  }

//////////////////////////////////////////////

  /** Busca todos os registros de Pessoas */
  async findEstadosAll(
    where?: FindOptionsWhere<EstadosEntity>, 
    order?: FindOptionsOrder<EstadosEntity>
  ): Promise<EstadosEntity[]> {
    return this.repo.find({ where, order });
  }
  /** Cria novo registro  */
  async createEstados(estados: EstadosCreate): Promise<EstadosEntity> {
    const data = this.repo.create(estados);
    return this.repo.save(data);
  }

  /** Busca registro pelo ID */
  async findEstadosById(estadosId: number): Promise<EstadosEntity | null> {
    if (!estadosId || isNaN(estadosId) || estadosId <= 0) {
      throw new Error('Invalid pessoasId');
    }
    return this.repo.findOne({ where: { id: estadosId } });
  }

  /** Atualiza registro (seguro com preload) */
  async updateEstados(
    estadosId: number, 
    estados: DeepPartial<EstadosEntity>
    ): Promise<EstadosEntity> {
    if (!estadosId || isNaN(estadosId) || estadosId <= 0) {
      throw new Error('Invalid pessoasId');
    }

    const entity = await this.repo.preload({ id: estadosId, ...estados });
    if (!entity) {
      throw new Error(`Pessoa com id ${estadosId} não encontrada`);
    }

    return this.repo.save(entity);
  }

  /** Deleta registro em pessoas */
  async deleteEstados(estadosId: number): Promise<void> {
    const entity = await this.repo.findOne({ where: { id: estadosId } });
    if (!entity) throw new Error(`Pessoa com id ${estadosId} não encontrada`);
    await this.repo.remove(entity);
  }
  
  /** Busca por ID, nome ou uf */
  async searchEstados(params: { id?: number; nome?: string; uf?: string }) {
    const query = this.repo.createQueryBuilder('estados')
      .select(['estados.id', 'estados.nome', 'estados.uf'])
      .orderBy('estados.id', 'ASC');

    if (params.id) query.andWhere('estados.id = :id', { id: params.id });
    if (params.nome) query.andWhere('estados.nome LIKE :nome', { nome: `%${params.nome}%` });
    if (params.uf) query.andWhere('estados.uf LIKE :sigla', { uf: `%${params.uf}%` });

    return query.getMany();
  }

  /** Busca pelo nome */
  async searchNameEstados(text?: string) {
    const query = this.repo.createQueryBuilder('estados')
      .select(['estados.id', 'estados.nome'])
      .orderBy('estados.id', 'ASC')
      .limit(100);
    if (text) query.andWhere('estados.nome LIKE :text', { text: `%${text}%` });
    return query.getMany();
  }

  /** Busca pela sigla */
  async searchUfEstados(text?: string) {
    const query = this.repo.createQueryBuilder('estados')
      .select(['estados.id', 'estados.uf'])
      .limit(100);
    if (text) query.andWhere('estados.uf LIKE :text', { text: `%${text}%` });
    return query.getMany();
  }

  /** Busca um registro pelo nome */
  async findOneNomeEstados(nome: string): Promise<EstadosEntity | null> {
    return this.repo.findOne({ where: { nome } });
  }

  /** Busca todos registros pelo nome (igualdade exata, limitado a 100) */
  async findAllNomeEstados(nome: string): Promise<EstadosEntity[]> {
    return this.repo.find({
      where: { nome },
      take: 100,
      order: { id: "ASC" }
    });
  }

  /** Busca um registro pela uf */
  async findOneUfEstados(uf: string): Promise<EstadosEntity | null> {
    return this.repo.findOne({ where: { uf } });
  }

  /** Busca todos registros pelo uf (igualdade exata, limitado a 100) */
  async findAllUfEstados(uf: string): Promise<EstadosEntity[]> {
    return this.repo.find({
      where: { uf },
      take: 100,
      order: { id: "ASC" }
    });
  }
}
