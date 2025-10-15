

// src/use-cases/pessoa/pessoas.repository.ts

import { DataSource, DeepPartial, Repository, FindOptionsWhere, FindOptionsOrder } from 'typeorm';
import {requiredImagens } from './../../config/imagens';
import { ImagensEntity, ArqTipoEnum, ArqAcaoEnum } from './imagens.entity';
import { ImagensCreate } from './imagens.dto';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

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
        id_empresas INT UNSIGNED NULL,
        id_consumidores INT UNSIGNED NULL,
        id_clientes INT UNSIGNED NULL,
        id_fornecedores INT UNSIGNED NULL,
        id_funcionarios INT UNSIGNED NULL,
        id_default INT UNSIGNED DEFAULT 0,
        arqTipo TINYINT UNSIGNED NOT NULL COMMENT '1=default,2=logo,3=painel,4=avatar,5=botao',
        arqAcao TINYINT UNSIGNED NOT NULL COMMENT '1=visualiza,2=cadastro,3=inclusao,4=alteracao,5=exclusao,6=listagem,7=help',
        arqNome VARCHAR(150) NOT NULL COLLATE utf8mb4_general_ci,
        arqPage VARCHAR(100) NULL COLLATE utf8mb4_general_ci,
        arqPath VARCHAR(255) NOT NULL COLLATE utf8mb4_general_ci,
        arqBlob LONGBLOB NULL,
        createBy INT UNSIGNED DEFAULT 0,
        createAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updateBy INT UNSIGNED DEFAULT 0,
        updateAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_arqNome_tipo_page (arqNome, arqTipo, arqPage)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);
  }

  /** Verifica duplicidade de imagem */
  async hasDuplicated(
    arqNome: string,
    arqTipo: number,
    arqAcao: number,
    arqPage?: string | null,
    excludes: number[] = []
  ): Promise<ImagensEntity | null> {
    const query = this.repo.createQueryBuilder('img')
      .where('img.arqNome = :arqNome', { arqNome })
      .andWhere('img.arqTipo = :arqTipo', { arqTipo })
      .andWhere('img.arqAcao = :arqAcao', { arqAcao });

    if (arqPage) {
      query.andWhere('img.arqPage = :arqPage', { arqPage });
    } else {
      query.andWhere('img.arqPage IS NULL');
    }

    if (excludes.length) {
      query.andWhere('img.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }

  /** Insere ou atualiza imagens default do sistema */
  async insertDefaultImagens(this: any): Promise<void> {
    const basePath = 'C:/SysBordados/default';

    // 1️⃣ Cria a pasta se não existir
    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath, { recursive: true });
      console.log('Pasta criada:', basePath);
    }

    // 2️⃣ Descompacta o ZIP dos arquivos default
    const zipPath = path.resolve(__dirname, '../../assets/defaults/imagens.zip');
    if (fs.existsSync(zipPath)) {
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(basePath, true);
      console.log('ZIP descompactado em:', basePath);
    } else {
      console.warn('ZIP não encontrado em:', zipPath);
    }

    // 🔹 Funções de mapeamento de string para enums numéricos
    function mapArqTipo(tipo: string): ArqTipoEnum {
      switch (tipo.toLowerCase()) {
        case 'default': return ArqTipoEnum.DEFAULT;
        case 'logo': return ArqTipoEnum.LOGO;
        case 'painel': return ArqTipoEnum.PAINEL;
        case 'avatar': return ArqTipoEnum.AVATAR;
        case 'botao': return ArqTipoEnum.BOTAO;
        default: return ArqTipoEnum.DEFAULT;
      }
    }

    function mapArqAcao(acao: string): ArqAcaoEnum {
      switch (acao.toLowerCase()) {
        case 'visualiza': return ArqAcaoEnum.VISUALIZA;
        case 'cadastro': return ArqAcaoEnum.CADASTRO;
        case 'inclusao': return ArqAcaoEnum.INCLUSAO;
        case 'alteracao': return ArqAcaoEnum.ALTERACAO;
        case 'exclusao': return ArqAcaoEnum.EXCLUSAO;
        case 'listagem': return ArqAcaoEnum.LISTAGEM;
        case 'help': return ArqAcaoEnum.HELP;
        default: return ArqAcaoEnum.VISUALIZA;
      }
    }

    // 3️⃣ Processa cada arquivo da lista requiredImagens
    for (const imgDef of requiredImagens) {
      const filepath = path.join(basePath, imgDef.arqNome);

      // 3️⃣a Verifica se existe no banco
      const existing = await this.hasDuplicated(
        imgDef.arqNome,
        mapArqTipo(imgDef.arqTipo),
        mapArqAcao(imgDef.arqAcao),
        imgDef.arqPage ?? null
      );

      // 3️⃣b Verifica se arquivo existe no disco
      if (!fs.existsSync(filepath)) {
        console.warn(`Arquivo default não encontrado no disco: ${filepath}`);
        continue;
      }

      const buffer = fs.readFileSync(filepath);

      // 3️⃣c Se existe no banco, compara timestamps
      if (existing) {
        const fileMTime = fs.statSync(filepath).mtime.getTime();
        const dbTime = existing.updatedAt.getTime();

        if (dbTime >= fileMTime) {
          console.log(`Imagem atualizada no banco: ${imgDef.arqNome}, nada a fazer.`);
          continue; // banco está mais recente ou igual
        }
      }

      // 3️⃣d Cria registro usando DTO
      const record: ImagensCreate = {
        id_default: imgDef.id_default,
        arqTipo: mapArqTipo(imgDef.arqTipo),
        arqAcao: mapArqAcao(imgDef.arqAcao),
        arqNome: imgDef.arqNome,
        arqPage: imgDef.arqPage ?? null,
        arqPath: filepath,
        arqBlob: buffer,
        createBy: 0,
        updateBy: 0,
        // FKs opcionais podem ser undefined por enquanto
      };

      await this.repo.save(this.repo.create(record as ImagensEntity));
      console.log(`Imagem default inserida ou atualizada no banco: ${imgDef.arqNome}`);
    }
  }

  /** Atualiza registro em imagens (seguro com preload) */
  async updateImagensId(
    imagensId: number,
    imagens: DeepPartial<ImagensEntity>
  ): Promise<ImagensEntity> {
    if (!imagensId || isNaN(imagensId) || imagensId <= 0) {
      throw new Error('ID de imagem inválido');
    }

    // Carrega a entidade com pré-carregamento das propriedades existentes
    const entity = await this.repo.preload({ id: imagensId, ...imagens });
    if (!entity) {
      throw new Error(`Imagem com id ${imagensId} não encontrada`);
    }

    // Bloqueia alterações em registros default (id_default = 1)
    if (entity.id_default === 1) {
      const allowedFields: (keyof DeepPartial<ImagensEntity>)[] = ['updateBy'];
      for (const key of Object.keys(imagens) as (keyof DeepPartial<ImagensEntity>)[]) {
        if (!allowedFields.includes(key)) {
          delete (entity as any)[key];
        }
      }
      console.warn(
        `Registro default (id=${imagensId}) não pode ser alterado. Apenas campos permitidos foram atualizados.`
      );
    }

    return this.repo.save(entity);
  }

  /** Deleta um registro de imagem pelo ID */
  async deleteImagensId(imagensId: number): Promise<void> {
    if (!imagensId || isNaN(imagensId) || imagensId <= 0) {
      throw new Error('ID de imagem inválido');
    }

    const entity = await this.repo.findOne({ where: { id: imagensId } });
    if (!entity) throw new Error(`Imagem com id ${imagensId} não encontrada`);

    // Bloqueia remoção de registros default
    if (entity.id_default === 1) {
      throw new Error(`Não é permitido deletar registro default (id=${imagensId})`);
    }

    await this.repo.remove(entity);
    console.log(`Imagem id=${imagensId} removida com sucesso.`);
  }

  /////////////////////////////////////////////////////////////



  /** Busca todos os registros de imagens */
  async findImagensAll(
    where?: FindOptionsWhere<ImagensEntity>,
    orderBy: Record<string, 'ASC' | 'DESC'> = { id: 'ASC' }
  ): Promise<ImagensEntity[]> {
    return this.repo.find({
      where,
      order: orderBy,
      relations: [
        'empresas',
        'consumidores',
        'clientes',
        'fornecedores',
        'funcionarios',
      ],
    });
  }

  async findImagensById(imagensId: number): Promise<ImagensEntity | null> {
    if (!imagensId || isNaN(imagensId) || imagensId <= 0) {
      throw new Error('Invalid imagensId');
    }
    return this.repo.findOne({
      where: { id: imagensId },
      relations: [
        'empresas',
        'consumidores',
        'clientes',
        'fornecedores',
        'funcionarios',
      ],
    });
  }

sadasdaddasdas


  /** Busca por ID, arqTipo ou arqNome */
  async searchImagens(params: { id?: number; arqTipo?: string; arqNome?: string; }): Promise<ImagensEntity[]> {
    const query = this.repo.createQueryBuilder('imagens')
      .select(['imagens.id', 'imagens.arqTipo', 'imagens.arqNome'])
      .orderBy('imagens.id', 'ASC');

    if (params.id) query.andWhere('imagens.id = :id', { id: params.id });
    if (params.arqTipo) query.andWhere('imagens.arqTipo LIKE :arqTipo', { arqTipo: `%${params.arqTipo}%` });
    if (params.arqNome) query.andWhere('imagens.arqNome LIKE :arqNome', { arqNome: `%${params.arqNome}%` });

    return query.getMany();
  }


  /** Busca pela arqtipo */
  async searchArqTipoImagens(text?: string) {
    const query = this.repo.createQueryBuilder('imagens')
      .select(['imagens.id', 'imagens.arqTipo'])
      .limit(100);
    if (text) query.andWhere('imagens.arqTipo LIKE :text', { text: `%${text}%` });
    return query.getMany();
  }

  /** Busca pelo arqNome */
  async searchArqNomeImagens(text?: string) {
    const query = this.repo.createQueryBuilder('imagens')
      .select(['imagens.id', 'imagens.arqNome'])
      .orderBy('imagens.id', 'ASC')
      .limit(100);
    if (text) query.andWhere('imagens.arqNome LIKE :text', { text: `%${text}%` });
    return query.getMany();
  }

  /** Busca um registro pelo nome */
  async findOneArqNomeImagens(arqNome: string): Promise<ImagensEntity | null> {
    if (!arqNome || !arqNome.trim()) {
      throw new Error('O parâmetro arqNome é inválido');
    }
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


