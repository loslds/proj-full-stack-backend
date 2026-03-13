
//C:\repository\proj-full-stack-backend\src\services\tables\imagens.service.ts
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

export const imagensService = {
  tableName: 'imagens',

  // ==========================================================
  // GARANTE CONEXÃO COM O BANCO
  // ==========================================================
  async ensureConnection(): Promise<void> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  },

  // ==========================================================
  // CRIA A TABELA IMAGENS
  // ==========================================================
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

  // ==========================================================
  // PROCESSO DE SEED / SINCRONIZAÇÃO
  //
  // FLUXO:
  // 1) cria pastas base
  // 2) verifica src\assets\arq_zip
  // 3) descompacta apenas zips padrão
  // 4) cada zip vai para sua pasta correta
  // 5) valida arquivos da pasta
  // 6) remove os inválidos
  // 7) insere / atualiza tabela imagens
  // ==========================================================
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
        '>>> [imagensService] nenhum arquivo .zip encontrado em src\\assets\\arq_zip'
      );
      console.log('>>> [imagensService] seed() encerrado sem processamento');
      return;
    }

    const tempRoot = fs.mkdtempSync(
      path.join(os.tmpdir(), 'sgv-imagens-zip-')
    );

    const arquivosComErro: Array<{ arquivo: string; motivo: string }> = [];

    try {
      for (const zipName of zipFiles) {
        if (!this.isZipPadrao(zipName)) {
          console.warn(
            `>>> [imagensService][ZIP IGNORADO] arquivo fora do padrão: ${zipName}`
          );
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

        // pasta destino do zip atual
        const destinoDir = this.detectZipDestinoDir(zipName);

        // percorre o conteúdo descompactado
        const extractedFiles = this.walkFiles(extractDir);

        for (const filePath of extractedFiles) {
          const nome = path.basename(filePath);

          // 1) somente .svg
          if (!nome.toLowerCase().endsWith('.svg')) {
            console.warn(
              `>>> [imagensService][ARQUIVO INVÁLIDO] ignorado: ${nome} | motivo: extensão inválida`
            );
            continue;
          }

          // 2) valida se o nome combina com a pasta destino
          const validacao = this.validateFileForFolder(nome, destinoDir);

          if (!validacao.valid) {
            console.warn(
              `>>> [imagensService][ARQUIVO INVÁLIDO] ignorado: ${nome} | motivo: ${validacao.motivo}`
            );
            continue;
          }

          // 3) copia para a pasta real do projeto
          const finalPath = path.join(destinoDir, nome);

          try {
            const svg = fs.readFileSync(filePath, 'utf8');
            this.writeSvgToDisk(finalPath, svg);
          } catch (error: any) {
            arquivosComErro.push({
              arquivo: nome,
              motivo: `falha ao gravar em pasta destino: ${error?.message ?? 'erro desconhecido'}`
            });

            console.error(
              `>>> [imagensService][ERRO] falha ao gravar ${nome} em ${destinoDir}:`,
              error
            );
          }
        }
      }

      // depois de organizar nas pastas corretas, sincroniza com o banco
      await this.syncFolderWithDatabase(SYSTEM_PATHS.IMAGENS_DEFAULT);
      await this.syncFolderWithDatabase(SYSTEM_PATHS.IMAGENS_FOTO);
      await this.syncFolderWithDatabase(SYSTEM_PATHS.IMAGENS_IMG);

      if (arquivosComErro.length > 0) {
        console.log(
          `>>> [imagensService] arquivos com erro: ${arquivosComErro.length}`
        );
        console.table(arquivosComErro);
      }

      console.log('>>> [imagensService] seed() concluído');
    } finally {
      try {
        fs.rmSync(tempRoot, { recursive: true, force: true });
      } catch {
        // silencioso
      }
    }
  },

  // ==========================================================
  // CONTA REGISTROS
  // ==========================================================
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

  // ==========================================================
  // RESERVADO
  // ==========================================================
  async update(): Promise<void> {
    // reservado para futuras atualizações
  },

  // ==========================================================
  // CRIA PASTAS BASE
  // ==========================================================
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

  // ==========================================================
  // VERIFICA SE O ZIP ESTÁ NO PADRÃO DO SISTEMA
  // ==========================================================
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

  // ==========================================================
  // DEFINE O DESTINO PELO NOME DO ZIP
  //
  // REGRA:
  // avt_sys.zip -> default
  // btn_sys.zip -> default
  // lg_sys.zip  -> default
  // pnl_sys.zip -> default
  // fot_sys.zip -> foto
  // img_sys.zip -> img
  // ==========================================================
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

  // ==========================================================
  // VALIDA NOME DO ARQUIVO CONFORME A PASTA
  //
  // REGRA DE PRIORIDADE:
  // 1) se tiver _def_ -> só pode estar em default
  // 2) sem _def_:
  //    fot_ -> foto
  //    img_ -> img
  // ==========================================================
  validateFileForFolder(
    fileName: string,
    folderPath: string
  ): { valid: boolean; motivo?: string } {
    const lower = fileName.toLowerCase();

    // somente .svg
    if (!lower.endsWith('.svg')) {
      return {
        valid: false,
        motivo: 'extensão inválida, somente .svg é permitido'
      };
    }

    // prioridade absoluta: qualquer *_def_* vai para default
    if (lower.includes('_def_')) {
      if (folderPath !== SYSTEM_PATHS.IMAGENS_DEFAULT) {
        return {
          valid: false,
          motivo: 'arquivo com _def_ só pode ir para a pasta default'
        };
      }

      return { valid: true };
    }

    // pasta foto -> somente fot_<nome>.svg
    if (folderPath === SYSTEM_PATHS.IMAGENS_FOTO) {
      if (!lower.startsWith('fot_')) {
        return {
          valid: false,
          motivo: 'arquivo inválido para pasta foto, esperado prefixo fot_'
        };
      }

      return { valid: true };
    }

    // pasta img -> somente img_<nome>.svg
    if (folderPath === SYSTEM_PATHS.IMAGENS_IMG) {
      if (!lower.startsWith('img_')) {
        return {
          valid: false,
          motivo: 'arquivo inválido para pasta img, esperado prefixo img_'
        };
      }

      return { valid: true };
    }

    // pasta default -> sem _def_ não entra
    if (folderPath === SYSTEM_PATHS.IMAGENS_DEFAULT) {
      return {
        valid: false,
        motivo: 'arquivo em default sem _def_ no nome'
      };
    }

    return {
      valid: false,
      motivo: 'pasta de destino desconhecida'
    };
  },

  // ==========================================================
  // DETECTA O TIPO DA IMAGEM PELO PREFIXO
  // ==========================================================
  detectTipo(nome: string): ImagemTipo {
    const lower = nome.toLowerCase();

    if (lower.startsWith('avt_')) return 'avatar';
    if (lower.startsWith('fot_')) return 'foto';
    if (lower.startsWith('btn_')) return 'botao';
    if (lower.startsWith('lg_')) return 'logo';
    if (lower.startsWith('pnl_')) return 'painel';

    return 'img';
  },

  // ==========================================================
  // GRAVA SVG EM DISCO
  // ==========================================================
  writeSvgToDisk(fullPath: string, svg: string): void {
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, svg, 'utf8');
  },

  // ==========================================================
  // SINCRONIZA UMA PASTA COM A TABELA IMAGENS
  //
  // 1) percorre arquivos da pasta
  // 2) valida de novo nome/extensão
  // 3) remove inválidos
  // 4) insere/atualiza no banco
  // ==========================================================
  async syncFolderWithDatabase(folderPath: string): Promise<void> {
    const allFiles = this.walkFiles(folderPath);

    const registrosPreparados: ImagemRegistro[] = [];

    for (const filePath of allFiles) {
      const nome = path.basename(filePath);

      const validacao = this.validateFileForFolder(nome, folderPath);

      if (!validacao.valid) {
        try {
          fs.unlinkSync(filePath);
          console.warn(
            `>>> [imagensService][ARQUIVO INVÁLIDO] removido: ${filePath} | motivo: ${validacao.motivo}`
          );
        } catch (error) {
          console.error(
            `>>> [imagensService][ERRO] falha ao remover arquivo inválido: ${filePath}`,
            error
          );
        }

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

      // INSERT
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

      // UPDATE somente se mudou
      const changed =
        existente.svg !== item.svg ||
        existente.tipo !== item.tipo ||
        (existente.path_origem ?? '') !== item.path_origem ||
        (existente.path_dest ?? '') !== item.path_dest;

      if (!changed) {
        console.log(`>>> [imagensService] sem alterações: ${item.nome}`);
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

  // ==========================================================
  // EXPORTA TUDO DO BANCO PARA O DISCO
  //
  // Mantido para uso futuro, se você quiser regravar tudo.
  // ==========================================================
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

  // ==========================================================
  // DESCOMPACTA ZIP
  // ==========================================================
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

  // ==========================================================
  // LISTA TODOS OS ARQUIVOS DE UMA PASTA
  // ==========================================================
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