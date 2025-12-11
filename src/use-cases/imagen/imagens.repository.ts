
//C:\repository\proj-full-stack-backend\src\use-cases\imagen\imagens.repository.ts
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import { ImagensEntity } from './imagens.entity';
import { imagensConfig } from '../../config/imagens';
import { DataSource, DeepPartial, Repository, FindOptionsWhere, IsNull } from 'typeorm';
import { ImagensCreate } from './imagens.dto';


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
        id_cadastros INT NOT NULL,
        nome VARCHAR(50) NOT NULL,
        nome_ext VARCHAR(80) NOT NULL,
        has_avatar TINYINT(1) NOT NULL DEFAULT 0,
        has_logo   TINYINT(1) NOT NULL DEFAULT 0,
        has_panel  TINYINT(1) NOT NULL DEFAULT 0,
        has_button TINYINT(1) NOT NULL DEFAULT 0,
        has_tabela TINYINT(1) NOT NULL DEFAULT 0,
        has_foto   TINYINT(1) NOT NULL DEFAULT 0,
        arqDir VARCHAR(100) NOT NULL DEFAULT 'C:\\SGB',
        arqPath VARCHAR(255) NOT NULL,
        arqBlob LONGBLOB NULL,
        createBy INT UNSIGNED DEFAULT 0,
        createAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updateBy INT UNSIGNED DEFAULT 0,
        updateAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);
  }

  /** Verifica duplicidade de imagem considerando nome, tipo, ação e página */
  async hasDuplicated(
    nome: string,
    arqNome: string,
    arqTipo: number,
    arqAcao: number,
    arqPage?: string | null,
    excludes: number[] = []
  ): Promise<ImagensEntity | null> {
    const query = this.repo.createQueryBuilder('img')
      .where('img.nome = :nome', { nome })
      .andWhere('img.arqNome = :arqNome', { arqNome })
      .andWhere('img.arqTipo = :arqTipo', { arqTipo })
      .andWhere('img.arqAcao = :arqAcao', { arqAcao });

    if (arqPage) {
      query.andWhere('img.arqPage = :arqPage', { arqPage });
    } else {
      query.andWhere('img.arqPage IS NULL');
    }

    if (excludes.length > 0) {
      query.andWhere('img.id NOT IN (:...excludes)', { excludes });
    }

    return await query.getOne();
  }


  /** Insere ou atualiza imagens de acordo com os arquivos ZIP configurados */
  async insertDefaultImagens(): Promise<void> {
    const baseAssets = path.resolve(__dirname, '../../assets/defaults');
    const baseDisk = 'C:/SGB';

    for (const cfg of imagensConfig) {
      const zipPath = path.join(baseAssets, cfg.zip);
      const tablePath = path.join(baseDisk, cfg.nome);

      // Cria a pasta da tabela se não existir
      if (!fs.existsSync(tablePath)) {
        fs.mkdirSync(tablePath, { recursive: true });
        console.log(`Pasta criada: ${tablePath}`);
      }

      // Descompacta ZIP se existir
      if (!fs.existsSync(zipPath)) {
        console.warn(`ZIP não encontrado para ${cfg.nome}: ${zipPath}`);
        continue;
      }

      const zip = new AdmZip(zipPath);
      zip.extractAllTo(tablePath, true);
      console.log(`ZIP descompactado em: ${tablePath}`);

      // Processa cada arquivo do diretório
      const files = fs.readdirSync(tablePath);
      for (const file of files) {
        const filepath = path.join(tablePath, file);
        const buffer = fs.readFileSync(filepath);

        // Determina arqTipo, arqAcao e arqPage pelo nome do arquivo
        const [prefix, pageNameWithExt] = file.split('_');
        const pageName = pageNameWithExt ? pageNameWithExt.split('.')[0] : null;

        const record: ImagensCreate = {
          nome: cfg.nome,
          arqNome: file,
          arqTipo:
            prefix.toLowerCase() === 'logo' ? ArqTipoEnum.LOGO :
            prefix.toLowerCase() === 'painel' ? ArqTipoEnum.PAINEL :
            prefix.toLowerCase() === 'avatar' ? ArqTipoEnum.AVATAR :
            prefix.toLowerCase() === 'btn' ? ArqTipoEnum.BOTAO :
            ArqTipoEnum.DEFAULT,
          arqAcao: ArqAcaoEnum.VISUALIZA, // padrão, ajustar conforme necessário
          arqPage: pageName,
          arqPath: filepath,
          arqBlob: buffer,
          createBy: 0,
          updateBy: 0,
        };

        // Verifica duplicidade usando IsNull para arqPage
        const existing = await this.repo.findOne({
          where: {
            nome: record.nome,
            arqNome: record.arqNome,
            arqTipo: record.arqTipo,
            arqAcao: record.arqAcao,
            arqPage: record.arqPage ?? IsNull(),
          },
        });

        if (existing) {
          // Atualiza se necessário
          await this.repo.save({ ...existing, ...record });
          console.log(`Imagem atualizada no banco: ${file}`);
        } else {
          // Insere nova
          await this.repo.save(this.repo.create(record as ImagensEntity));
          console.log(`Imagem inserida no banco: ${file}`);
        }
      }
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




  // /** Busca por ID, arqTipo ou arqNome */
  // async searchImagens(params: { id?: number; arqTipo?: string; arqNome?: string; }): Promise<ImagensEntity[]> {
  //   const query = this.repo.createQueryBuilder('imagens')
  //     .select(['imagens.id', 'imagens.arqTipo', 'imagens.arqNome'])
  //     .orderBy('imagens.id', 'ASC');

  //   if (params.id) query.andWhere('imagens.id = :id', { id: params.id });
  //   if (params.arqTipo) query.andWhere('imagens.arqTipo LIKE :arqTipo', { arqTipo: `%${params.arqTipo}%` });
  //   if (params.arqNome) query.andWhere('imagens.arqNome LIKE :arqNome', { arqNome: `%${params.arqNome}%` });

  //   return query.getMany();
  // }


  // /** Busca pela arqtipo */
  // async searchArqTipoImagens(text?: string) {
  //   const query = this.repo.createQueryBuilder('imagens')
  //     .select(['imagens.id', 'imagens.arqTipo'])
  //     .limit(100);
  //   if (text) query.andWhere('imagens.arqTipo LIKE :text', { text: `%${text}%` });
  //   return query.getMany();
  // }

  // /** Busca pelo arqNome */
  // async searchArqNomeImagens(text?: string) {
  //   const query = this.repo.createQueryBuilder('imagens')
  //     .select(['imagens.id', 'imagens.arqNome'])
  //     .orderBy('imagens.id', 'ASC')
  //     .limit(100);
  //   if (text) query.andWhere('imagens.arqNome LIKE :text', { text: `%${text}%` });
  //   return query.getMany();
  // }

  // /** Busca um registro pelo nome */
  // async findOneArqNomeImagens(arqNome: string): Promise<ImagensEntity | null> {
  //   if (!arqNome || !arqNome.trim()) {
  //     throw new Error('O parâmetro arqNome é inválido');
  //   }
  //   return this.repo.findOne({ where: { arqNome } });
  // }

  // /** Busca todos registros pelo arqTipo (igualdade exata, limitado a 100) */
  // async findAllArqTipoImagens(arqTipo: 'logo' | 'avatar'): Promise<ImagensEntity[]> {
  //   return this.repo.find({
  //     where: { arqTipo },
  //     take: 100,
  //     order: { id: "ASC" }
  //   });
  // }

  // /** Lista todos registros pelo arqNome (igualdade exata, limitado a 100) */
  // async findAllArqNomeImagens(arqNome: string): Promise<ImagensEntity[]> {
  //   return this.repo.find({
  //     where: { arqNome },
  //     take: 100,
  //     order: { id: "ASC" }
  //   });
  // }
  
}


