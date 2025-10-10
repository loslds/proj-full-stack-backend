

// src/use-cases/pessoa/pessoas.repository.ts
import { DataSource, DeepPartial, Repository, FindOptionsWhere, FindOptionsOrder } from 'typeorm';
import {requiredImagens } from './../../config/imagens';
import { ImagensEntity } from './imagens.entity';
import { ImagensCreate } from './imagens.dto';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

lista requiredImagens
export class ImagensRepository {
  private repo: Repository<ImagensEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(ImagensEntity);
  }

  /** Cria a tabela 'imagens' caso não exista */
// 📁 src/use-cases/imagens/imagens.repository.ts

async createNotExistsImagens(): Promise<void> {
  await this.dataSource.query(`
    CREATE TABLE IF NOT EXISTS imagens (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

      -- Identificador para imagens padrão do sistema (ex: logos default, avatars default)
      id_default INT UNSIGNED DEFAULT 0,

      -- Relações opcionais com outras tabelas (FKs)
      id_empresas INT UNSIGNED NULL,
      id_consumidores INT UNSIGNED NULL,
      id_clientes INT UNSIGNED NULL,
      id_fornecedores INT UNSIGNED NULL,
      id_funcionarios INT UNSIGNED NULL,

      -- Tipo da imagem (enum do banco)
      arqTipo ENUM(
        'default',
        'logo',
        'avatar',
        'inclusao',
        'alteracao',
        'exclusao',
        'listagem',
        'help'
      ) NOT NULL,

      -- Nome do arquivo (único por tipo + page)
      arqNome VARCHAR(150) NOT NULL COLLATE utf8mb4_general_ci,

      -- Página ou contexto onde a imagem é usada
      arqPage VARCHAR(100) NULL COLLATE utf8mb4_general_ci,

      -- Caminho e conteúdo
      arqPath VARCHAR(255) NOT NULL COLLATE utf8mb4_general_ci,
      arqBlob LONGBLOB NULL,

      -- Auditoria
      createBy INT UNSIGNED DEFAULT 0,
      createAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updateBy INT UNSIGNED DEFAULT 0,
      updateAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      -- Unicidade nome+tipo+página
      UNIQUE KEY uq_arqNome_tipo_page (arqNome, arqTipo, arqPage),

      -- Foreign Keys
      CONSTRAINT fk_imagens_empresas FOREIGN KEY (id_empresas) REFERENCES empresas(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
      CONSTRAINT fk_imagens_consumidores FOREIGN KEY (id_consumidores) REFERENCES consumidores(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
      CONSTRAINT fk_imagens_clientes FOREIGN KEY (id_clientes) REFERENCES clientes(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
      CONSTRAINT fk_imagens_fornecedores FOREIGN KEY (id_fornecedores) REFERENCES fornecedores(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
      CONSTRAINT fk_imagens_funcionarios FOREIGN KEY (id_funcionarios) REFERENCES funcionarios(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);
  }
  


  //  * 🔍 Verifica duplicidade de imagem com base em nome, tipo e página
  //  * @param arqNome Nome do arquivo (obrigatório)
  //  * @param arqTipo Tipo do arquivo (ex: logo, avatar, listagem, help...)
  //  * @param arqPage Nome da página ou contexto (pode ser nulo)
  //  * @param excludes IDs a serem ignorados (ex: na edição)
  //  *
  async hasDuplicated(
    arqNome: string,
    arqTipo: string,
    arqPage?: string | null,
    excludes: number[] = []
    ) {
    const query = this.repo.createQueryBuilder('img')
      .select()
      .where('img.arqNome = :arqNome', { arqNome })
      .andWhere('img.arqTipo = :arqTipo', { arqTipo });

    if (arqPage) {
      query.andWhere('img.arqPage = :arqPage', { arqPage });
    } else {
      // Se não tiver página, garantir que a coluna seja NULL
      query.andWhere('img.arqPage IS NULL');
    }

    if (excludes.length) {
      query.andWhere('img.id NOT IN(:...excludes)', { excludes });
    }

    return query.getOne();
  }




  /** Insere registros padrão de Imagens */
  async insertDefaultImagens(): Promise<void> {
    const basePath = 'C:/SysBordados/assets/imagens';

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

    // 3️⃣ Lista final de arquivos default com extensão incluída
    const allImages: { name: string; type: 'logo' | 'avatar' }[] = requiredImagens.map(file => {
      const type: 'logo' | 'avatar' = file.toLowerCase().includes('logo') ? 'logo' : 'avatar';
      return { name: file, type };
    });

    for (const img of allImages) {
      const filepath = path.join(basePath, img.name);

    // 3️⃣a Verifica duplicidade no banco
    const duplicated = await this.hasDuplicated(img.name, img.type);
    if (duplicated) {
      console.log(`Imagem default já existe no banco: ${img.name} (${img.type})`);
      continue;
    }

    // 3️⃣b Verifica se arquivo existe no disco
    if (!fs.existsSync(filepath)) {
      console.warn(`Arquivo default não encontrado no disco: ${filepath}`);
      continue;
    }

    // 3️⃣c Lê o arquivo
    const buffer = fs.readFileSync(filepath);

      // 3️⃣d Cria registro usando DTO
      const record: ImagensCreate = {
        id_default: 1,
        arqTipo: img.type,
        arqNome: img.name,
        arqPath: filepath,
        arqBlob: buffer,
        createBy: 0,
        updateBy: 0
        // FK opcionais podem ficar undefined por enquanto
      };

      await this.repo.save(this.repo.create(record as ImagensEntity));
      console.log(`Imagem default inserida no banco: ${img.name} (${img.type})`);
    }
  }
  
  
  /** Atualiza registro em imagens (seguro com preload) */
  async updateImagensId(
    imagensId: number, 
    imagens: DeepPartial<ImagensEntity>
  ): Promise<ImagensEntity> {
    if (!imagensId || isNaN(imagensId) || imagensId <= 0) {
      throw new Error('Invalid imagensId');
    }

    const entity = await this.repo.preload({ id: imagensId, ...imagens });
    if (!entity) {
      throw new Error(`Imagem com id ${imagensId} não encontrada`);
    }

    // Bloqueia alterações em registros default
    if (entity.id_default === 1) {
      const allowedFields: (keyof DeepPartial<ImagensEntity>)[] = ['updateBy'];
      Object.keys(imagens).forEach(key => {
        if (!allowedFields.includes(key as keyof DeepPartial<ImagensEntity>)) {
          delete (entity as any)[key];
        }
      });
      console.warn(`Registro default id=${imagensId} não pode ser alterado. Apenas campos permitidos foram atualizados.`);
    }

    return this.repo.save(entity);
  }
  
  /** Deleta registro em imagens */
async deleteImagensId(imagensId: number): Promise<void> {
  const entity = await this.repo.findOne({ where: { id: imagensId } });
  if (!entity) throw new Error(`Imagem com id ${imagensId} não encontrada`);

  // Bloqueia remoção de registros default
  if (entity.id_default === 1) {
    throw new Error(`Não é permitido deletar registro default (id=${imagensId})`);
  }

  await this.repo.remove(entity);
  console.log(`Imagem id=${imagensId} removida com sucesso.`);
}

  /** Busca todos os registros de imagens */
  async findImagensAll(
    where?: FindOptionsWhere<ImagensEntity>, 
    order?: FindOptionsOrder<ImagensEntity>
  ): Promise<ImagensEntity[]> {
    return this.repo.find({ where, order });
  }

 async findImagensById(imagensId: number): Promise<ImagensEntity | null> {
    if (!imagensId || isNaN(imagensId) || imagensId <= 0) {
      throw new Error('Invalid imagensId');
    }
    return this.repo.findOne({ where: { id: imagensId } });
  }

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


