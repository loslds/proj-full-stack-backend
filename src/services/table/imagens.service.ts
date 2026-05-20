 
// C:\repository\proj-full-stack-backend\src\services\table\imagens.service.ts

import fs from 'fs';
import path from 'path';
import os from 'os';
import { execFileSync } from 'child_process';

import { AppDataSource } from '../../config/db';
import { SYSTEM_PATHS } from '../../config/systemPaths';

// ============================================================
// * TYPES *
// ============================================================

type ImagemTipo = 'avatar' | 'botao' | 'foto' | 'logo' | 'painel' | 'img';

type ImagemRegistro = {
  nome: string;
  tipo: ImagemTipo;
  path_origem: string;
  path_dest: string;
  public_url: string;
  svg: string;
  createdBy: number;
  updatedBy: number;
  persistir?: boolean;
};

type ImagemDbRow = {
  id: number;
  nome: string;
  tipo: string;
  path_origem: string | null;
  path_dest: string | null;
  public_url: string | null;
  svg: string;
};

type SeedItemValido = ImagemRegistro;

type SeedItemErro = {
  arquivo: string;
  origem?: string;
  destino?: string;
  motivo: string;
};

type SeedResultado = {
  zipLidos: string[];
  validos: SeedItemValido[];
  rejeitados: SeedItemErro[];
  invalidos: SeedItemErro[];
  duplicados: SeedItemErro[];
  erros: SeedItemErro[];
};

type UpdateResultado = {
  sincronizadosNoBanco: number;
  exportadosNoDisco: number;
  erros: SeedItemErro[];
};

// ============================================================
// * SERVICE *
// ============================================================

export const imagensService = {
  tableName: 'imagens',

  // ============================================================
  // * CONNECTION *
  // ============================================================
  async ensureConnection(): Promise<void> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  },

  // ============================================================
  // * CREATE TABLE *
  // ============================================================
  async create(): Promise<void> {
    await this.ensureConnection();

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

        public_url VARCHAR(255)
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

        UNIQUE KEY uk_imagens_nome (nome),
        INDEX idx_imagens_tipo (tipo),
        INDEX idx_imagens_public_url (public_url)
      )
    `);
  },

  // ============================================================
  // * COUNT *
  // ============================================================
  async count(): Promise<number> {
    await this.ensureConnection();

    const result = await AppDataSource.query(`
      SELECT COUNT(*) AS total
      FROM imagens
    `);

    return Number(result?.[0]?.total ?? 0);
  },

  // ============================================================
  // * SEED *
  // ============================================================
  async seed(): Promise<SeedResultado> {
    await this.ensureConnection();
    await this.create();

    this.createFolders();

    const resultado = this.criarEstruturaResultado();
    const zipSourceDir = path.resolve(SYSTEM_PATHS.ZIP_SOURCE);

    if (!fs.existsSync(zipSourceDir)) {
      resultado.erros.push({
        arquivo: 'ZIP_SOURCE',
        origem: zipSourceDir,
        motivo: 'pasta de zips não encontrada'
      });

      return resultado;
    }

    const zipFiles = fs
      .readdirSync(zipSourceDir)
      .filter(file => file.toLowerCase().endsWith('.zip'));

    resultado.zipLidos = [...zipFiles];

    if (zipFiles.length === 0) {
      return resultado;
    }

    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sgb-imagens-zip-'));

    try {
      for (const zipName of zipFiles) {
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

        const extractedFiles = this.walkFiles(extractDir);

        if (extractedFiles.length === 0) {
          resultado.invalidos.push({
            arquivo: zipName,
            origem: zipFullPath,
            motivo: 'zip sem arquivos após descompactação'
          });
          continue;
        }

        for (const filePath of extractedFiles) {
          const nome = path.basename(filePath);
          const classificacao = this.classifyExtractedFile(nome);

          if (!classificacao.valid || !classificacao.destino || !classificacao.tipo) {
            resultado.invalidos.push({
              arquivo: nome,
              origem: filePath,
              motivo: classificacao.motivo ?? 'arquivo fora do padrão'
            });
            continue;
          }

          const finalPath = this.resolveDestinationPath(
            classificacao.destino,
            nome,
            classificacao.persistir === false
          );

          if (classificacao.persistir === false) {
            try {
              this.copyFileToDisk(filePath, finalPath);

              resultado.rejeitados.push({
                arquivo: nome,
                origem: filePath,
                destino: finalPath,
                motivo: classificacao.motivo ?? 'arquivo enviado para quarentena'
              });
            } catch (error: any) {
              resultado.erros.push({
                arquivo: nome,
                origem: filePath,
                destino: finalPath,
                motivo: `falha ao enviar para quarentena: ${error?.message ?? 'erro desconhecido'}`
              });
            }

            continue;
          }

          if (
            resultado.validos.some(
              item => item.nome.toLowerCase() === nome.toLowerCase()
            )
          ) {
            resultado.duplicados.push({
              arquivo: nome,
              origem: filePath,
              motivo: 'arquivo duplicado dentro do processamento atual'
            });
            continue;
          }

          const publicUrl = this.buildPublicUrl(finalPath);

          try {
            const svg = fs.readFileSync(filePath, 'utf8');

            resultado.validos.push({
              nome,
              tipo: classificacao.tipo,
              path_origem: filePath,
              path_dest: finalPath,
              public_url: publicUrl,
              svg,
              createdBy: 0,
              updatedBy: 0,
              persistir: true
            });
          } catch (error: any) {
            resultado.erros.push({
              arquivo: nome,
              origem: filePath,
              motivo: `falha ao ler arquivo: ${error?.message ?? 'erro desconhecido'}`
            });
          }
        }
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

      await this.persistirSeed(
        resultado.validos.filter(item => item.persistir !== false)
      );

      return resultado;
    } finally {
      try {
        fs.rmSync(tempRoot, { recursive: true, force: true });
      } catch {
        // silencioso
      }
    }
  },

  // ============================================================
  // * UPDATE / SYNC *
  // ============================================================
  async update(): Promise<UpdateResultado> {
    await this.ensureConnection();
    await this.create();

    this.createFolders();

    const erros: SeedItemErro[] = [];
    let sincronizadosNoBanco = 0;
    let exportadosNoDisco = 0;

    try {
      const pastasParaSincronizar = [
        SYSTEM_PATHS.IMAGENS_DEFAULT_AVT,
        SYSTEM_PATHS.IMAGENS_DEFAULT_BTN,
        SYSTEM_PATHS.IMAGENS_DEFAULT_LG,
        SYSTEM_PATHS.IMAGENS_DEFAULT_PNL,
        SYSTEM_PATHS.IMAGENS_DEFAULT_FT,

        SYSTEM_PATHS.IMAGENS_USERCLIENTS_FT,
        SYSTEM_PATHS.IMAGENS_USERCLIENTS_LG
      ];

      for (const folderPath of pastasParaSincronizar) {
        const total = await this.syncFolderWithDatabase(folderPath);
        sincronizadosNoBanco += total;
      }

      exportadosNoDisco = await this.exportAllFromDbToDisk();

      return {
        sincronizadosNoBanco,
        exportadosNoDisco,
        erros
      };
    } catch (error: any) {
      erros.push({
        arquivo: 'update',
        motivo: error?.message ?? 'erro desconhecido'
      });

      return {
        sincronizadosNoBanco,
        exportadosNoDisco,
        erros
      };
    }
  },

/////////////////////////////////////////
// ============================================================
// * PERSIST DATABASE *
// Persiste somente registros válidos.
// Se o nome não existir, insere.
// Se o nome já existir, atualiza sempre.
// Isso força a versão mais recente do arquivo como oficial,
// mesmo quando nome, tamanho ou path forem iguais.
// Arquivos de quarentena nunca devem chegar aqui.
// ============================================================
async persistirSeed(items: SeedItemValido[]): Promise<void> {
  for (const item of items) {
    if (item.persistir === false) {
      continue;
    }

    const existingRows: ImagemDbRow[] = await AppDataSource.query(
      `
      SELECT
        id,
        nome,
        tipo,
        path_origem,
        path_dest,
        public_url,
        svg
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
          (
            nome,
            tipo,
            path_origem,
            path_dest,
            public_url,
            svg,
            createdBy,
            updatedBy
          )
        VALUES
          (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          item.nome,
          item.tipo,
          item.path_origem,
          item.path_dest,
          item.public_url,
          item.svg,
          item.createdBy,
          item.updatedBy
        ]
      );

      console.info(`[IMAGENS][DB][INSERT] ${item.nome}`);
      continue;
    }

    await AppDataSource.query(
      `
      UPDATE imagens
         SET tipo = ?,
             path_origem = ?,
             path_dest = ?,
             public_url = ?,
             svg = ?,
             updatedBy = ?,
             updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?
      `,
      [
        item.tipo,
        item.path_origem,
        item.path_dest,
        item.public_url,
        item.svg,
        item.updatedBy,
        existente.id
      ]
    );

    console.info(`[IMAGENS][DB][UPDATE-FORCADO] ${item.nome}`);
  }
},
  // ============================================================
  // * RESULT STRUCTURE *
  // ============================================================
  criarEstruturaResultado(): SeedResultado {
    return {
      zipLidos: [],
      validos: [],
      rejeitados: [],
      invalidos: [],
      duplicados: [],
      erros: []
    };
  },

  // ============================================================
  // * FOLDERS *
  // ============================================================
  createFolders(): void {
    const dirs = [
      SYSTEM_PATHS.IMAGENS_BASE,

      SYSTEM_PATHS.IMAGENS_DEFAULTS,
      SYSTEM_PATHS.IMAGENS_DEFAULT_AVT,
      SYSTEM_PATHS.IMAGENS_DEFAULT_BTN,
      SYSTEM_PATHS.IMAGENS_DEFAULT_LG,
      SYSTEM_PATHS.IMAGENS_DEFAULT_PNL,
      SYSTEM_PATHS.IMAGENS_DEFAULT_FT,

      SYSTEM_PATHS.IMAGENS_USERCLIENTS,
      SYSTEM_PATHS.IMAGENS_USERCLIENTS_FT,
      SYSTEM_PATHS.IMAGENS_USERCLIENTS_LG,

      SYSTEM_PATHS.IMAGENS_REJEITADAS_IMG,

      SYSTEM_PATHS.ZIP_SOURCE
    ];

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  },

  // ============================================================
  // * PUBLIC URL *
  // ============================================================
  buildPublicUrl(fullPath: string): string {
    const base = path.resolve(SYSTEM_PATHS.IMAGENS_BASE);
    const target = path.resolve(fullPath);

    const relative = path
      .relative(base, target)
      .replace(/\\/g, '/');

    return `/assets/${relative}`;
  },

  // ============================================================
  // * CLASSIFICATION *
  // ============================================================
  classifyExtractedFile(
    fileName: string
  ): {
    persistir?: boolean;
    valid: boolean;
    destino?: string;
    tipo?: ImagemTipo;
    motivo?: string;
  } {
    const lower = fileName.toLowerCase();

    // ==========================================================
    // EXTENSÃO INVÁLIDA
    // vai para quarentena, mas não entra no banco
    // ==========================================================
    if (!lower.endsWith('.svg')) {
      return {
        valid: true,
        persistir: false,
        destino: SYSTEM_PATHS.IMAGENS_REJEITADAS_IMG,
        tipo: 'img',
        motivo: 'extensão inválida enviada para quarentena'
      };
    }

    // ==========================================================
    // DEFAULTS DO SISTEMA
    // obrigatoriamente com _def_
    // ==========================================================
    if (lower.startsWith('avt_') && lower.includes('_def_')) {
      return {
        valid: true,
        persistir: true,
        destino: SYSTEM_PATHS.IMAGENS_DEFAULT_AVT,
        tipo: 'avatar'
      };
    }

    if (lower.startsWith('btn_') && lower.includes('_def_')) {
      return {
        valid: true,
        persistir: true,
        destino: SYSTEM_PATHS.IMAGENS_DEFAULT_BTN,
        tipo: 'botao'
      };
    }

    if (lower.startsWith('ft_') && lower.includes('_def_')) {
      return {
        valid: true,
        persistir: true,
        destino: SYSTEM_PATHS.IMAGENS_DEFAULT_FT,
        tipo: 'foto'
      };
    }

    if (lower.startsWith('lg_') && lower.includes('_def_')) {
      return {
        valid: true,
        persistir: true,
        destino: SYSTEM_PATHS.IMAGENS_DEFAULT_LG,
        tipo: 'logo'
      };
    }

    if (lower.startsWith('pnl_') && lower.includes('_def_')) {
      return {
        valid: true,
        persistir: true,
        destino: SYSTEM_PATHS.IMAGENS_DEFAULT_PNL,
        tipo: 'painel'
      };
    }

    // ==========================================================
    // USERCLIENTS
    // ft_ e lg_ sem _def_ são imagens reais de cliente/empresa
    // ==========================================================
    if (lower.startsWith('ft_')) {
      return {
        valid: true,
        persistir: true,
        destino: SYSTEM_PATHS.IMAGENS_USERCLIENTS_FT,
        tipo: 'foto'
      };
    }

    if (lower.startsWith('lg_')) {
      return {
        valid: true,
        persistir: true,
        destino: SYSTEM_PATHS.IMAGENS_USERCLIENTS_LG,
        tipo: 'logo'
      };
    }

    // ==========================================================
    // QUARENTENA
    // qualquer SVG não reconhecido fica fora do banco
    // ==========================================================
    return {
      valid: true,
      persistir: false,
      destino: SYSTEM_PATHS.IMAGENS_REJEITADAS_IMG,
      tipo: 'img',
      motivo: 'arquivo svg não reconhecido enviado para quarentena'
    };
  },

  detectTipo(nome: string): ImagemTipo {
    const lower = nome.toLowerCase();

    if (lower.startsWith('avt_')) return 'avatar';
    if (lower.startsWith('btn_')) return 'botao';
    if (lower.startsWith('ft_')) return 'foto';
    if (lower.startsWith('lg_')) return 'logo';
    if (lower.startsWith('pnl_')) return 'painel';

    return 'img';
  },

  // ============================================================
  // * FILE SYSTEM *
  // ============================================================
  writeSvgToDisk(fullPath: string, svg: string): void {
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, svg, 'utf8');
  },

  copyFileToDisk(sourcePath: string, destPath: string): void {
    const dir = path.dirname(destPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.copyFileSync(sourcePath, destPath);
  },

  resolveDestinationPath(destino: string, nome: string, avoidOverwrite = false): string {
    const parsed = path.parse(nome);
    let finalPath = path.join(destino, nome);

    if (!avoidOverwrite || !fs.existsSync(finalPath)) {
      return finalPath;
    }

    const timestamp = new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, '');

    finalPath = path.join(
      destino,
      `${parsed.name}_${timestamp}${parsed.ext}`
    );

    return finalPath;
  },

  async syncFolderWithDatabase(folderPath: string): Promise<number> {
    const allFiles = this.walkFiles(folderPath);
    const registrosPreparados: ImagemRegistro[] = [];

    for (const filePath of allFiles) {
      const nome = path.basename(filePath);
      const classificacao = this.classifyExtractedFile(nome);

      if (
        !classificacao.valid ||
        !classificacao.tipo ||
        !classificacao.destino ||
        classificacao.persistir === false
      ) {
        continue;
      }

      try {
        const svg = fs.readFileSync(filePath, 'utf8');

        registrosPreparados.push({
          nome,
          tipo: classificacao.tipo,
          path_origem: filePath,
          path_dest: filePath,
          public_url: this.buildPublicUrl(filePath),
          svg,
          createdBy: 0,
          updatedBy: 0,
          persistir: true
        });
      } catch {
        continue;
      }
    }

    await this.persistirSeed(registrosPreparados);

    return registrosPreparados.length;
  },

  async exportAllFromDbToDisk(): Promise<number> {
    await this.ensureConnection();

    const rows: ImagemDbRow[] = await AppDataSource.query(`
      SELECT
        id,
        nome,
        tipo,
        path_origem,
        path_dest,
        public_url,
        svg
      FROM imagens
      ORDER BY id ASC
    `);

    let exportados = 0;

    for (const row of rows) {
      if (!row.path_dest || row.path_dest.trim() === '') {
        continue;
      }

      try {
        this.writeSvgToDisk(row.path_dest, row.svg);
        exportados++;
      } catch {
        continue;
      }
    }

    return exportados;
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

