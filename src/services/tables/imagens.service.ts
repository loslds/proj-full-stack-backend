
//C:\repository\proj-full-stack-backend\src\services\tables\imagens.service.ts

// src/services/tables/imagens.service.ts
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
        '>>> [imagensService] nenhum arquivo .zip encontrado em src/arq_zip'
      );
      console.log('>>> [imagensService] seed() encerrado sem processamento');
      return;
    }

    const tempRoot = fs.mkdtempSync(
      path.join(os.tmpdir(), 'sgv-imagens-zip-')
    );

    const registrosPreparados: ImagemRegistro[] = [];
    const arquivosComErro: Array<{ arquivo: string; motivo: string }> = [];

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
          arquivosComErro.push({
            arquivo: zipName,
            motivo: `falha ao descompactar: ${error?.message ?? 'erro desconhecido'}`
          });

          console.error(
            `>>> [imagensService][ERRO] falha ao descompactar ${zipName}:`,
            error
          );
          continue;
        }

        const extractedFiles = this.walkFiles(extractDir).filter(file => {
          const ext = path.extname(file).toLowerCase();
          return ext === '.svg' || ext === '.sgv';
        });

        for (const filePath of extractedFiles) {
          try {
            const nome = path.basename(filePath).replace(/\.sgv$/i, '.svg');
            const svg = fs.readFileSync(filePath, 'utf8');
            const tipo = this.detectTipo(nome);
            const destinoDir = this.detectDestinoDir(nome, tipo);
            const pathDest = path.join(destinoDir, nome);

            registrosPreparados.push({
              nome,
              tipo,
              path_origem: filePath,
              path_dest: pathDest,
              svg,
              createdBy: 0,
              updatedBy: 0
            });
          } catch (error: any) {
            arquivosComErro.push({
              arquivo: filePath,
              motivo: `falha ao ler arquivo: ${error?.message ?? 'erro desconhecido'}`
            });

            console.error(
              `>>> [imagensService][ERRO] falha ao ler arquivo ${filePath}:`,
              error
            );
          }
        }
      }

      console.log(
        `>>> [imagensService] registros preparados: ${registrosPreparados.length}`
      );

      if (arquivosComErro.length > 0) {
        console.log(
          `>>> [imagensService] arquivos com erro: ${arquivosComErro.length}`
        );
        console.table(arquivosComErro);
      }

      for (const item of registrosPreparados) {
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

          this.writeSvgToDisk(item.path_dest, item.svg);

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
          this.writeSvgToDisk(item.path_dest, item.svg);

          console.log(
            `>>> [imagensService] sem alterações: ${item.nome}`
          );
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

        this.writeSvgToDisk(item.path_dest, item.svg);

        console.log(
          `>>> [imagensService] UPDATE imagem: ${item.nome} (${item.tipo})`
        );
      }

      await this.exportAllFromDbToDisk();

      console.log('>>> [imagensService] seed() concluído');
    } finally {
      try {
        fs.rmSync(tempRoot, { recursive: true, force: true });
      } catch {
        // silencioso
      }
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
    // reservado para futuras atualizações
  },

  createFolders(): void {
    const dirs = [
      SYSTEM_PATHS.IMAGENS_BASE,
      SYSTEM_PATHS.IMAGENS_DEFAULT,
      SYSTEM_PATHS.IMAGENS_FOTO,
      SYSTEM_PATHS.IMAGENS_IMG
    ];

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`>>> [imagensService] pasta criada: ${dir}`);
      }
    }
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

  detectDestinoDir(nome: string, tipo: ImagemTipo): string {
    const lower = nome.toLowerCase();

    if (lower.includes('def')) {
      return SYSTEM_PATHS.IMAGENS_DEFAULT;
    }

    if (tipo === 'foto') {
      return SYSTEM_PATHS.IMAGENS_FOTO;
    }

    return SYSTEM_PATHS.IMAGENS_IMG;
  },

  writeSvgToDisk(fullPath: string, svg: string): void {
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, svg, 'utf8');
  },

  async exportAllFromDbToDisk(): Promise<void> {
    const rows: ImagemDbRow[] = await AppDataSource.query(`
      SELECT id, nome, tipo, path_origem, path_dest, svg
      FROM imagens
      ORDER BY id ASC
    `);

    for (const row of rows) {
      const destino =
        row.path_dest && row.path_dest.trim() !== ''
          ? row.path_dest
          : path.join(this.detectDestinoDir(row.nome, this.detectTipo(row.nome)), row.nome);

      this.writeSvgToDisk(destino, row.svg);
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