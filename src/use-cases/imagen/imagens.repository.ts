

// src/use-cases/pessoa/pessoas.repository.ts
import { DataSource, DeepPartial, Repository, FindOptionsWhere, FindOptionsOrder } from 'typeorm';
import { ImagensEntity } from './imagens.entity';
import type { ImagensCreate } from './imagens.dto';
import {requiredLogo, requiredAvatar } from './../../config/imagens';
import * as fs from 'fs';
import * as path from 'path';

export class ImagensRepository {
  private repo: Repository<ImagensEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(ImagensEntity);
  }

  /** Cria a tabela 'imagens' caso não exista */
  async createNotExistsImagens(): Promise<void> {
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS imagens (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        arqTipo ENUM('logo','avatar') NOT NULL,
        arqNome VARCHAR(150) NOT NULL COLLATE utf8mb4_general_ci,
        arqPath VARCHAR(255) NOT NULL COLLATE utf8mb4_general_ci,
        arqBlob LONGBLOB NULL,
        createBy INT UNSIGNED DEFAULT 0,
        createAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updateBy INT UNSIGNED DEFAULT 0,
        updateAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_arqNome_tipo (arqNome, arqTipo)
      )
    `);
  }

  /** Verifica duplicidade de registro em imagens */
  async hasDuplicated(arqNome?: string, arqTipo?: 'logo' | 'avatar', excludes: number[] = []) {
    const query = this.repo.createQueryBuilder('imagens')
      .select()
      .where('imagens.arqNome = :arqNome', { arqNome })
      .andWhere('imagens.arqTipo = :arqTipo', { arqTipo });

    if (excludes.length) {
      query.andWhere('imagens.id NOT IN(:...excludes)', { excludes });
    }

    return query.getOne();
  }


  /** Insere registros padrão de Imagens */
  async insertDefaultImagens(): Promise<void> {
    const basePath = 'C:/SysBordados/assets/imagens';

    // Lista final: todos avatares + logos
    const allImages: { name: string; type: 'logo' | 'avatar' }[] = [
      ...requiredLogo.map(name => ({ name, type: 'logo' as const })),
      ...requiredAvatar.map(name => ({ name, type: 'avatar' as const }))
    ];

    for (const img of allImages) {
      const filename = `${img.name}.svg`;
      const filepath = path.join(basePath, filename);

      // Verifica duplicidade no banco
      const duplicated = await this.hasDuplicated(img.name, img.type);
      if (duplicated) {
        console.log(`Imagem já existe: ${img.name} (${img.type})`);
        continue;
      }

      // Verifica se arquivo existe no disco
      if (!fs.existsSync(filepath)) {
        console.warn(`Arquivo não encontrado: ${filepath}`);
        continue;
      }

      // Lê o arquivo (pode ser grande → melhor usar readFileSync para LONGBLOB)
      const buffer = fs.readFileSync(filepath);

      // Cria e salva
      const record = this.repo.create({
        arqTipo: img.type,
        arqNome: img.name,
        arqPath: filepath,
        arqBlob: buffer
      });

      await this.repo.save(record);
      console.log(`Imagem inserida: ${img.name} (${img.type})`);
    }
  }

  
  async createImagens(imagens: ImagensCreate): Promise<ImagensEntity> {
  const payload: DeepPartial<ImagensEntity> = {
    arqTipo: imagens.arqTipo,
    arqNome: imagens.arqNome,
    arqPath: imagens.arqPath,
    arqBlob: imagens.arqBlob ?? undefined, // converte null → undefined
  };

  const data = this.repo.create(payload);
  return this.repo.save(data);
}
 
  /** Atualiza registro em imagens (seguro com preload) */
  async updateImagens(
    imagensId: number, 
    imagens: DeepPartial<ImagensEntity>
    ): Promise<ImagensEntity> {
    if (!imagensId || isNaN(imagensId) || imagensId <= 0) {
      throw new Error('Invalid imagensId');
    }

    const entity = await this.repo.preload({ id: imagensId, ...imagens });
    if (!entity) {
      throw new Error(`Pessoa com id ${imagensId} não encontrada`);
    }

    return this.repo.save(entity);
  }

  /** Deleta registro em imagens */
  async deleteImagens(imagensId: number): Promise<void> {
    const entity = await this.repo.findOne({ where: { id: imagensId } });
    if (!entity) throw new Error(`Imagens com id ${imagensId} não encontrada`);
    await this.repo.remove(entity);
  }

  /** Busca todos os registros de imagens */
  async findImagensAll(
    where?: FindOptionsWhere<ImagensEntity>, 
    order?: FindOptionsOrder<ImagensEntity>
  ): Promise<ImagensEntity[]> {
    return this.repo.find({ where, order });
  }

  /** Busca registro de imagens pelo ID */
  async findImagensById(imagensId: number): Promise<ImagensEntity | null> {
    if (!imagensId || isNaN(imagensId) || imagensId <= 0) {
      throw new Error('Invalid imagensId');
    }
    return this.repo.findOne({ where: { id: imagensId } });
  }

  /** Busca por ID, arqtipo ou arqnome */
  async searchImagens(params: { id?: number; arqTipo?: string; arqNome?: string; }) {
    const query = this.repo.createQueryBuilder('imagens')
      .select(['imagens.id', 'imagens.arqTipo', 'imagens.arqNome'])
      .orderBy('pessoas.id', 'ASC');

    if (params.id) query.andWhere('imagens.id = :id', { id: params.id });
    if (params.arqTipo) query.andWhere('imagens.arqTipo LIKE :arqtipo', { arqTipo: `%${params.arqTipo}%` });
    if (params.arqNome) query.andWhere('imagens.arqNome LIKE :arqnome', { arqNome: `%${params.arqNome}%` });

    return query.getMany();
  }

  /** Busca pela arqtipo */
  async searchArqTipoImagens(text?: string) {
    const query = this.repo.createQueryBuilder('imagens')
      .select(['imagens.id', 'imagens.arqTipo'])
      .limit(100);
    if (text) query.andWhere('imagens.arqtipo LIKE :text', { text: `%${text}%` });
    return query.getMany();
  }

  /** Busca pelo arqNome */
  async searchArqNameImagens(text?: string) {
    const query = this.repo.createQueryBuilder('imagens')
      .select(['imagens.id', 'imagens.arqNome'])
      .orderBy('imagens.id', 'ASC')
      .limit(100);
    if (text) query.andWhere('imagens.arqnome LIKE :text', { text: `%${text}%` });
    return query.getMany();
  }

  /** Busca um registro pelo nome */
  async findOneArqNomeImagens(arqNome: string): Promise<ImagensEntity | null> {
    return this.repo.findOne({ where: { arqNome } });
  }

  /** Busca todos registros pelo arqTipo (igualdade exata, limitado a 100) */
  async findAllArqTipoImagens(arqTipo: 'logo' | 'avatar'): Promise<ImagensEntity[]> {
    return this.repo.find({
      where: { arqTipo },
      take: 100,
      order: { id: "ASC" }
    });
  }

  /** Lista todos registros pelo arqNome (igualdade exata, limitado a 100) */
  async findAllArqNomeImagens(arqNome: string): Promise<ImagensEntity[]> {
    return this.repo.find({
      where: { arqNome },
      take: 100,
      order: { id: "ASC" }
    });
  }
  
}


