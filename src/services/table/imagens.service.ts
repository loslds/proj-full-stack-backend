
 
// C:\repository\proj-full-stack-backend\src\services\tables\imagens.service.ts
import fs from 'fs';
import path from 'path';
import os from 'os';
import { execFileSync } from 'child_process';

import { AppDataSource } from '../../config/db';
import { SYSTEM_PATHS } from '../../config/systemPaths';

type ImagemTipo = 'avatar' | 'foto' | 'botao' | 'logo' | 'painel' | 'img';

type ImagemRegistro = {
  nome: string;
  tipo: ImagemTipo;
  path_origem: string;
  path_dest: string;
  svg: string;
  createdBy: number;
  updatedBy: number;
};

type ImagemDbRow = {
  id: number;
  nome: string;
  tipo: string;
  path_origem: string | null;
  path_dest: string | null;
  svg: string;
};

type ZipPadrao =
  | 'avt_sys.zip'
  | 'btn_sys.zip'
  | 'lg_sys.zip'
  | 'pnl_sys.zip'
  | 'fot_sys.zip'
  | 'img_sys.zip';

type SeedItemValido = ImagemRegistro;

type SeedItemErro = {
  arquivo: string;
  origem?: string;
  motivo: string;
};

type SeedResultado = {
  validos: SeedItemValido[];
  invalidos: SeedItemErro[];
  duplicados: SeedItemErro[];
  erros: SeedItemErro[];
};

export const imagensService = {
  tableName: 'imagens',

  async ensureConnection(): Promise<void> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  },

  async create(): Promise<void> {
    await this.ensureConnection();
    console.log('>>> [imagensService] create() iniciado');

    const currentDb = await AppDataSource.query('SELECT DATABASE() AS db');
    console.log('>>> [imagensService] banco atual:', currentDb);

    await AppDataSource.query(`
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

    console.log('>>> [imagensService] create() concluído');
  },

  async seed(): Promise<void> {
    await this.ensureConnection();
    await this.create();

    console.log('>>> [imagensService] seed() iniciado');

    this.createFolders();

    const zipSourceDir = path.resolve(SYSTEM_PATHS.ZIP_SOURCE);

    if (!fs.existsSync(zipSourceDir)) {
      console.log(
        `>>> [imagensService] pasta de origem não encontrada: ${zipSourceDir}`
      );
      console.log('>>> [imagensService] seed() encerrado sem processamento');
      return;
    }

    const zipFiles = fs
      .readdirSync(zipSourceDir)
      .filter(file => file.toLowerCase().endsWith('.zip'));

    if (zipFiles.length === 0) {
      console.log(
        '>>> [imagensService] nenhum arquivo .zip encontrado em src\\assets\\arq_zip'
      );
      console.log('>>> [imagensService] seed() encerrado sem processamento');
      return;
    }

    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sgv-imagens-zip-'));

    try {
      const resultado = this.criarEstruturaResultado();

      for (const zipName of zipFiles) {
        if (!this.isZipPadrao(zipName)) {
          resultado.invalidos.push({
            arquivo: zipName,
            origem: zipSourceDir,
            motivo: 'zip fora do padrão do sistema'
          });
          continue;
        }

        const zipFullPath = path.join(zipSourceDir, zipName);
        const extractDir = path.join(
          tempRoot,
          path.basename(zipName, path.extname(zipName))
        );

        fs.mkdirSync(extractDir, { recursive: true });

        try {
          this.extractZip(zipFullPath, extractDir);
        } catch (error: any) {
          resultado.erros.push({
            arquivo: zipName,
            origem: zipFullPath,
            motivo: `falha ao descompactar: ${error?.message ?? 'erro desconhecido'}`
          });
          continue;
        }

        const destinoDir = this.detectZipDestinoDir(zipName);
        const extractedFiles = this.walkFiles(extractDir);

        for (const filePath of extractedFiles) {
          const nome = path.basename(filePath);

          if (!nome.toLowerCase().endsWith('.svg')) {
            resultado.invalidos.push({
              arquivo: nome,
              origem: filePath,
              motivo: 'extensão inválida, somente .svg é permitido'
            });
            continue;
          }

          const validacao = this.validateFileForFolder(nome, destinoDir);

          if (!validacao.valid) {
            resultado.invalidos.push({
              arquivo: nome,
              origem: filePath,
              motivo: validacao.motivo ?? 'nomenclatura inválida'
            });
            continue;
          }

          const finalPath = path.join(destinoDir, nome);

          if (fs.existsSync(finalPath)) {
            resultado.duplicados.push({
              arquivo: nome,
              origem: finalPath,
              motivo: 'arquivo já existe na pasta destino'
            });
            continue;
          }

          if (resultado.validos.some(item => item.nome.toLowerCase() === nome.toLowerCase())) {
            resultado.duplicados.push({
              arquivo: nome,
              origem: filePath,
              motivo: 'arquivo duplicado dentro do processamento atual'
            });
            continue;
          }

          try {
            const svg = fs.readFileSync(filePath, 'utf8');
            const tipo = this.detectTipo(nome);

            resultado.validos.push({
              nome,
              tipo,
              path_origem: filePath,
              path_dest: finalPath,
              svg,
              createdBy: 0,
              updatedBy: 0
            });
          } catch (error: any) {
            resultado.erros.push({
              arquivo: nome,
              origem: filePath,
              motivo: `falha ao ler svg: ${error?.message ?? 'erro desconhecido'}`
            });
          }
        }
      }

      this.printSeedReport(resultado);

      if (resultado.validos.length === 0) {
        console.log('>>> [imagensService] nenhum arquivo válido encontrado para seed');
        return;
      }

      for (const item of resultado.validos) {
        try {
          this.writeSvgToDisk(item.path_dest, item.svg);
        } catch (error: any) {
          resultado.erros.push({
            arquivo: item.nome,
            origem: item.path_dest,
            motivo: `falha ao gravar em disco: ${error?.message ?? 'erro desconhecido'}`
          });
        }
      }

      if (resultado.erros.length > 0) {
        console.log('>>> [imagensService] erros após gravação em disco:');
        console.table(resultado.erros);
      }

      await this.persistirSeed(resultado.validos);

      console.log('>>> [imagensService] seed() concluído');
    } finally {
      try {
        fs.rmSync(tempRoot, { recursive: true, force: true });
      } catch {
        // silencioso
      }
    }
  },

  async persistirSeed(items: SeedItemValido[]): Promise<void> {
    for (const item of items) {
      const existingRows: ImagemDbRow[] = await AppDataSource.query(
        `
        SELECT id, nome, tipo, path_origem, path_dest, svg
        FROM imagens
        WHERE nome = ?
        LIMIT 1
        `,
        [item.nome]
      );

      const existente = existingRows[0];

      if (!existente) {
        await AppDataSource.query(
          `
          INSERT INTO imagens
            (nome, tipo, path_origem, path_dest, svg, createdBy, updatedBy)
          VALUES
            (?, ?, ?, ?, ?, ?, ?)
          `,
          [
            item.nome,
            item.tipo,
            item.path_origem,
            item.path_dest,
            item.svg,
            item.createdBy,
            item.updatedBy
          ]
        );

        console.log(
          `>>> [imagensService] INSERT imagem: ${item.nome} (${item.tipo})`
        );
        continue;
      }

      const changed =
        existente.svg !== item.svg ||
        existente.tipo !== item.tipo ||
        (existente.path_origem ?? '') !== item.path_origem ||
        (existente.path_dest ?? '') !== item.path_dest;

      if (!changed) {
        console.log(`>>> [imagensService] sem alterações no banco: ${item.nome}`);
        continue;
      }

      await AppDataSource.query(
        `
        UPDATE imagens
           SET tipo = ?,
               path_origem = ?,
               path_dest = ?,
               svg = ?,
               updatedBy = ?,
               updatedAt = CURRENT_TIMESTAMP
         WHERE id = ?
        `,
        [
          item.tipo,
          item.path_origem,
          item.path_dest,
          item.svg,
          item.updatedBy,
          existente.id
        ]
      );

      console.log(
        `>>> [imagensService] UPDATE imagem: ${item.nome} (${item.tipo})`
      );
    }
  },

  criarEstruturaResultado(): SeedResultado {
    return {
      validos: [],
      invalidos: [],
      duplicados: [],
      erros: []
    };
  },

  printSeedReport(resultado: SeedResultado): void {
    console.log('>>> [imagensService] resumo do seed');
    console.log(`>>> válidos: ${resultado.validos.length}`);
    console.log(`>>> inválidos: ${resultado.invalidos.length}`);
    console.log(`>>> duplicados: ${resultado.duplicados.length}`);
    console.log(`>>> erros: ${resultado.erros.length}`);

    if (resultado.validos.length > 0) {
      console.table(
        resultado.validos.map(item => ({
          nome: item.nome,
          tipo: item.tipo,
          path_dest: item.path_dest
        }))
      );
    }

    if (resultado.invalidos.length > 0) {
      console.log('>>> [imagensService] arquivos inválidos:');
      console.table(resultado.invalidos);
    }

    if (resultado.duplicados.length > 0) {
      console.log('>>> [imagensService] arquivos duplicados:');
      console.table(resultado.duplicados);
    }

    if (resultado.erros.length > 0) {
      console.log('>>> [imagensService] erros encontrados:');
      console.table(resultado.erros);
    }
  },

  async count(): Promise<number> {
    await this.ensureConnection();

    const result = await AppDataSource.query(`
      SELECT COUNT(*) AS total
      FROM imagens
    `);

    const total = Number(result?.[0]?.total ?? 0);
    console.log('>>> [imagensService] total de registros:', total);

    return total;
  },

  async update(): Promise<void> {
    // reservado
  },

  createFolders(): void {
    const dirs = [
      SYSTEM_PATHS.IMAGENS_BASE,
      SYSTEM_PATHS.IMAGENS_DEFAULT,
      SYSTEM_PATHS.IMAGENS_FOTO,
      SYSTEM_PATHS.IMAGENS_IMG,
      SYSTEM_PATHS.ZIP_SOURCE
    ];

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`>>> [imagensService] pasta criada: ${dir}`);
      }
    }
  },

  isZipPadrao(zipName: string): zipName is ZipPadrao {
    const lower = zipName.toLowerCase();

    return (
      lower === 'avt_sys.zip' ||
      lower === 'btn_sys.zip' ||
      lower === 'lg_sys.zip' ||
      lower === 'pnl_sys.zip' ||
      lower === 'fot_sys.zip' ||
      lower === 'img_sys.zip'
    );
  },

  detectZipDestinoDir(zipName: ZipPadrao): string {
    switch (zipName.toLowerCase()) {
      case 'avt_sys.zip':
      case 'btn_sys.zip':
      case 'lg_sys.zip':
      case 'pnl_sys.zip':
        return SYSTEM_PATHS.IMAGENS_DEFAULT;

      case 'fot_sys.zip':
        return SYSTEM_PATHS.IMAGENS_FOTO;

      case 'img_sys.zip':
        return SYSTEM_PATHS.IMAGENS_IMG;

      default:
        throw new Error(`Zip inválido para destino: ${zipName}`);
    }
  },

  validateFileForFolder(
    fileName: string,
    folderPath: string
  ): { valid: boolean; motivo?: string } {
    const lower = fileName.toLowerCase();

    if (!lower.endsWith('.svg')) {
      return {
        valid: false,
        motivo: 'extensão inválida, somente .svg é permitido'
      };
    }

    if (folderPath === SYSTEM_PATHS.IMAGENS_DEFAULT) {
      const prefixosValidos = ['avt_', 'btn_', 'lg_', 'pnl_'];
      const prefixoOk = prefixosValidos.some(prefixo => lower.startsWith(prefixo));

      if (!prefixoOk) {
        return {
          valid: false,
          motivo: 'prefixo inválido para pasta default'
        };
      }

      if (!lower.includes('_def_')) {
        return {
          valid: false,
          motivo: 'arquivo em default precisa conter _def_ no nome'
        };
      }

      return { valid: true };
    }

    if (folderPath === SYSTEM_PATHS.IMAGENS_FOTO) {
      if (!lower.startsWith('fot_')) {
        return {
          valid: false,
          motivo: 'arquivo inválido para pasta foto, esperado prefixo fot_'
        };
      }

      return { valid: true };
    }

    if (folderPath === SYSTEM_PATHS.IMAGENS_IMG) {
      if (!lower.startsWith('img_')) {
        return {
          valid: false,
          motivo: 'arquivo inválido para pasta img, esperado prefixo img_'
        };
      }

      return { valid: true };
    }

    return {
      valid: false,
      motivo: 'pasta de destino desconhecida'
    };
  },

  detectTipo(nome: string): ImagemTipo {
    const lower = nome.toLowerCase();

    if (lower.startsWith('avt_')) return 'avatar';
    if (lower.startsWith('fot_')) return 'foto';
    if (lower.startsWith('btn_')) return 'botao';
    if (lower.startsWith('lg_')) return 'logo';
    if (lower.startsWith('pnl_')) return 'painel';

    return 'img';
  },

  writeSvgToDisk(fullPath: string, svg: string): void {
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, svg, 'utf8');
  },

  async syncFolderWithDatabase(folderPath: string): Promise<void> {
    const allFiles = this.walkFiles(folderPath);
    const registrosPreparados: ImagemRegistro[] = [];

    for (const filePath of allFiles) {
      const nome = path.basename(filePath);
      const validacao = this.validateFileForFolder(nome, folderPath);

      if (!validacao.valid) {
        console.warn(
          `>>> [imagensService][ARQUIVO INVÁLIDO] ignorado: ${filePath} | motivo: ${validacao.motivo}`
        );
        continue;
      }

      try {
        const svg = fs.readFileSync(filePath, 'utf8');
        const tipo = this.detectTipo(nome);

        registrosPreparados.push({
          nome,
          tipo,
          path_origem: filePath,
          path_dest: filePath,
          svg,
          createdBy: 0,
          updatedBy: 0
        });
      } catch (error) {
        console.error(
          `>>> [imagensService][ERRO] falha ao ler arquivo: ${filePath}`,
          error
        );
      }
    }

    console.log(
      `>>> [imagensService] registros preparados da pasta ${folderPath}: ${registrosPreparados.length}`
    );

    await this.persistirSeed(registrosPreparados);
  },

  async exportAllFromDbToDisk(): Promise<void> {
    const rows: ImagemDbRow[] = await AppDataSource.query(`
      SELECT id, nome, tipo, path_origem, path_dest, svg
      FROM imagens
      ORDER BY id ASC
    `);

    for (const row of rows) {
      if (!row.path_dest || row.path_dest.trim() === '') {
        continue;
      }

      this.writeSvgToDisk(row.path_dest, row.svg);
    }

    console.log(
      `>>> [imagensService] exportação concluída: ${rows.length} arquivo(s)`
    );
  },

  extractZip(zipFullPath: string, extractDir: string): void {
    execFileSync(
      'powershell',
      [
        '-NoProfile',
        '-Command',
        `Expand-Archive -LiteralPath '${zipFullPath.replace(/'/g, "''")}' -DestinationPath '${extractDir.replace(/'/g, "''")}' -Force`
      ],
      { stdio: 'ignore' }
    );
  },

  walkFiles(dir: string): string[] {
    if (!fs.existsSync(dir)) return [];

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        files.push(...this.walkFiles(fullPath));
      } else {
        files.push(fullPath);
      }
    }

    return files;
  }
};

