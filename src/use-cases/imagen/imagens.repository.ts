
// C:\repository\proj-full-stack-backend\src\use-cases\imagen\imagens.repository.ts
import {
  DataSource,
  DeepPartial,
  Repository,
  FindOptionsWhere,
  FindOptionsOrder
} from 'typeorm';

import { ImagensEntity } from './imagens.entity';
import type { ImagensCreate } from './imagens.dto';

export class ImagensRepository {
  private repo: Repository<ImagensEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(ImagensEntity);
  }

  // ============================================================
  // * CRIAÇÃO DA TABELA *
  // ============================================================
  async createNotExistsImagens(): Promise<void> {
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS imagens (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

        nome VARCHAR(180)
          NOT NULL
          COLLATE utf8mb4_general_ci,

        tipo VARCHAR(30)
          NOT NULL
          COLLATE utf8mb4_general_ci,

        path_origem VARCHAR(255)
          NULL
          COLLATE utf8mb4_general_ci,

        path_dest VARCHAR(255)
          NULL
          COLLATE utf8mb4_general_ci,

        svg LONGTEXT
          NOT NULL
          COLLATE utf8mb4_general_ci,

        createdBy INT UNSIGNED
          NOT NULL
          DEFAULT 0,

        createdAt DATETIME
          DEFAULT CURRENT_TIMESTAMP,

        updatedBy INT UNSIGNED
          NOT NULL
          DEFAULT 0,

        updatedAt DATETIME
          DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP,

        UNIQUE KEY uk_imagens_nome (nome)
      )
    `);
  }

  // ============================================================
  // * DUPLICIDADE *
  // ============================================================
  async hasDuplicated(
    nome?: string,
    excludeId?: number
  ): Promise<boolean> {
    const query = this.repo
      .createQueryBuilder('imagens')
      .select(['imagens.id']);

    if (nome) {
      query.andWhere('imagens.nome = :nome', { nome });
    }

    if (excludeId) {
      query.andWhere('imagens.id != :excludeId', { excludeId });
    }

    const result = await query.getOne();
    return !!result;
  }

  // ============================================================
  // * INSERÇÃO DEFAULT *
  // A carga principal das imagens é feita pelo imagens.service.ts
  // ============================================================
  async insertDefaultImagens(): Promise<void> {
    console.log(
      '>>> [ImagensRepository] insertDefaultImagens() é controlado pelo imagens.service.ts'
    );
  }

  // ============================================================
  // * CRUD *
  // ============================================================
  async findImagensAll(
    where?: FindOptionsWhere<ImagensEntity>,
    order?: FindOptionsOrder<ImagensEntity>
  ): Promise<ImagensEntity[]> {
    return this.repo.find({ where, order });
  }

  async createImagens(imagens: ImagensCreate): Promise<ImagensEntity> {
    const duplicated = await this.hasDuplicated(imagens.nome);

    if (duplicated) {
      throw new Error(`Imagem duplicada! Já existe registro com nome "${imagens.nome}".`);
    }

    const entity = this.repo.create(imagens);
    return this.repo.save(entity);
  }

  async findImagensById(imagensId: number): Promise<ImagensEntity | null> {
    this.validateId(imagensId);
    return this.repo.findOne({ where: { id: imagensId } });
  }

  async updateImagens(
    imagensId: number,
    imagens: DeepPartial<ImagensEntity>
  ): Promise<ImagensEntity> {
    this.validateId(imagensId);

    if (imagens.nome) {
      const duplicated = await this.hasDuplicated(imagens.nome, imagensId);

      if (duplicated) {
        throw new Error(`Imagem duplicada! Já existe registro com nome "${imagens.nome}".`);
      }
    }

    const entity = await this.repo.preload({ id: imagensId, ...imagens });

    if (!entity) {
      throw new Error(`Imagem com id ${imagensId} não encontrada`);
    }

    return this.repo.save(entity);
  }

  async deleteImagens(imagensId: number): Promise<void> {
    this.validateId(imagensId);

    const found = await this.repo.findOne({ where: { id: imagensId } });

    if (!found) {
      throw new Error(`Imagem com id ${imagensId} não encontrada`);
    }

    await this.repo.remove(found);
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================
  async searchImagens(params: {
    id?: number;
    nome?: string;
    tipo?: string;
  }): Promise<ImagensEntity[]> {
    const query = this.repo
      .createQueryBuilder('imagens')
      .select([
        'imagens.id',
        'imagens.nome',
        'imagens.tipo',
        'imagens.path_origem',
        'imagens.path_dest',
        'imagens.createdAt',
        'imagens.updatedAt'
      ])
      .orderBy('imagens.id', 'ASC');

    if (params.id) {
      query.andWhere('imagens.id = :id', { id: params.id });
    }

    if (params.nome) {
      query.andWhere('imagens.nome LIKE :nome COLLATE utf8mb4_general_ci', {
        nome: `%${params.nome}%`
      });
    }

    if (params.tipo) {
      query.andWhere('imagens.tipo LIKE :tipo COLLATE utf8mb4_general_ci', {
        tipo: `%${params.tipo}%`
      });
    }

    return query.getMany();
  }

  async searchNomeImagens(text?: string): Promise<ImagensEntity[]> {
    const query = this.repo
      .createQueryBuilder('imagens')
      .select([
        'imagens.id',
        'imagens.nome',
        'imagens.tipo',
        'imagens.path_dest'
      ])
      .orderBy('imagens.id', 'ASC')
      .limit(100);

    if (text) {
      query.andWhere('imagens.nome LIKE :text COLLATE utf8mb4_general_ci', {
        text: `%${text}%`
      });
    }

    return query.getMany();
  }

  async searchTipoImagens(text?: string): Promise<ImagensEntity[]> {
    const query = this.repo
      .createQueryBuilder('imagens')
      .select([
        'imagens.id',
        'imagens.nome',
        'imagens.tipo',
        'imagens.path_dest'
      ])
      .orderBy('imagens.id', 'ASC')
      .limit(100);

    if (text) {
      query.andWhere('imagens.tipo LIKE :text COLLATE utf8mb4_general_ci', {
        text: `%${text}%`
      });
    }

    return query.getMany();
  }

  async findOneNomeImagens(nome: string): Promise<ImagensEntity | null> {
    return this.repo.findOne({ where: { nome } });
  }

  async findAllNomeImagens(nome: string): Promise<ImagensEntity[]> {
    return this.repo.find({
      where: { nome },
      order: { id: 'ASC' },
      take: 100
    });
  }

  async findOneTipoImagens(tipo: string): Promise<ImagensEntity | null> {
    return this.repo.findOne({ where: { tipo } });
  }

  async findAllTipoImagens(tipo: string): Promise<ImagensEntity[]> {
    return this.repo.find({
      where: { tipo },
      order: { id: 'ASC' },
      take: 100
    });
  }

  async findOnePathDestImagens(path_dest: string): Promise<ImagensEntity | null> {
    return this.repo.findOne({ where: { path_dest } });
  }

  // ============================================================
  // * UTIL *
  // ============================================================
  private validateId(id: number): void {
    if (!id || isNaN(id) || id <= 0) {
      throw new Error('Invalid imagensId');
    }
  }
}