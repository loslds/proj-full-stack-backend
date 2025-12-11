
 
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
  // ============================================================
  // * CRIAÇÃO DA TABELA *
  // ============================================================

  async createNotExistsEstados(): Promise<void> {
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS estados (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(60) NOT NULL COLLATE utf8mb4_general_ci UNIQUE,
        prefixo VARCHAR(5) NOT NULL,
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
    prefixo?: string,
    excludeId?: number
  ): Promise<boolean> {
    const query = this.repo.createQueryBuilder('estados')
      .select(['estados.id']);

    if (nome) query.andWhere('estados.nome = :nome', { nome });
    if (prefixo) query.andWhere('estados.prefixo = :prefixo', { prefixo });
    if (excludeId)
      query.andWhere('pessoas.id != :excludeId', { excludeId });

    const result = await query.getOne();
    return !!result;
  }
  // ============================================================
  // * INSERÇÃO DEFAULT *
  // ============================================================

  async insertDefaultEstados() {
    const batchSize = 300;

    for (let i = 0; i < requiredEstados.length; i += batchSize) {
      const batch = requiredEstados.slice(i, i + batchSize);

      for (const estado of batch) {
        const exists = await this.hasDuplicated(estado.nome, estado.prefixo);
        if (exists) continue;

        await this.repo.save(this.repo.create(estado));
      }
    }

    console.log(`✅ estados padrão inseridas (verificação incluída)`);
  }

  // ============================================================
  // * CRUD *
  // ============================================================

  async findEstadosAll(
    where?: FindOptionsWhere<EstadosEntity>,
    order?: FindOptionsOrder<EstadosEntity>
  ): Promise<EstadosEntity[]> {
    return this.repo.find({ where, order });
  }

  async createEstados(estados: EstadosCreate): Promise<EstadosEntity> {
    const entity = this.repo.create(estados);
    return this.repo.save(entity);
  }

  async findEstadosById(estadosId: number): Promise<EstadosEntity | null> {
    this.validateId(estadosId);
    return this.repo.findOne({ where: { id: estadosId } });
  }

  async updateEstados(
    estadosId: number,
    estados: DeepPartial<EstadosEntity>
  ): Promise<EstadosEntity> {
    this.validateId(estadosId);

    const entity = await this.repo.preload({ id: estadosId, ...estados });
    if (!entity) {
      throw new Error(`Estado com id ${estadosId} não encontrada`);
    }

    return this.repo.save(entity);
  }

  async deleteEstados(estadosId: number): Promise<void> {
    this.validateId(estadosId);

    const found = await this.repo.findOne({ where: { id: estadosId } });
    if (!found) {
      throw new Error(`Estado com id ${estadosId} não encontrada`);
    }

    await this.repo.remove(found);
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================

  async searchEstados(params: { id?: number; nome?: string; prefixo?: string }) {
    const query = this.repo.createQueryBuilder('estados')
      .select(['estados.id', 'estados.nome', 'estados.prefixo'])
      .orderBy('estados.id', 'ASC');

    if (params.id) query.andWhere('estados.id = :id', { id: params.id });
    if (params.nome)
      query.andWhere('estados.nome LIKE :nome COLLATE utf8mb4_general_ci', {
        nome: `%${params.nome}%`
      });
    if (params.prefixo)
      query.andWhere('estados.prefixo LIKE :prefixo COLLATE utf8mb4_general_ci', {
        prefixo: `%${params.prefixo}%`
      });

    return query.getMany();
  }

  async searchNomeEstados(text?: string) {
    const query = this.repo.createQueryBuilder('estados')
      .select(['estados.id', 'estados.nome', 'pessoas.prefixo'])
      .orderBy('estados.id', 'ASC')
      .limit(100);

    if (text)
      query.andWhere('estados.nome LIKE :text COLLATE utf8mb4_general_ci', {
        text: `%${text}%`
      });

    return query.getMany();
  }

  async searchPrefixoEstados(text?: string) {
    const query = this.repo.createQueryBuilder('estados')
      .select(['estados.id', 'estados.nome', 'estados.prefixo'])
      .orderBy('estados.id', 'ASC')
      .limit(100);

    if (text)
      query.andWhere('estados.prefixo LIKE :text COLLATE utf8mb4_general_ci', {
        text: `%${text}%`
      });

    return query.getMany();
  }

  async findOneNomeEstados(nome: string) {
    return this.repo.findOne({ where: { nome } });
  }

  async findAllNomeEstados(nome: string) {
    return this.repo.find({
      where: { nome },
      order: { id: 'ASC' },
      take: 100
    });
  }

  async findOnePrefixoEstados(prefixo: string) {
    return this.repo.findOne({ where: { prefixo } });
  }

  async findAllPrefixoEstados(prefixo: string) {
    return this.repo.find({
      where: { prefixo },
      order: { id: 'ASC' },
      take: 100
    });
  }

  // ============================================================
  // * UTIL *
  // ============================================================

  private validateId(id: number) {
    if (!id || isNaN(id) || id <= 0) {
      throw new Error('Invalid estadosId');
    }
  }
}
