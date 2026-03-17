
//C:\repository\proj-full-stack-backend\src\services\table\acoes.service.ts
import { AppDataSource } from '../../config/db';
import { acoesSeed } from './seed/acoes.seed';

type AcaoSeedRow = {
  nome: string;
  abrev: string;
  cor: string;
  nivel: number;
  createdBy?: number;
  updatedBy?: number;
};

type AcaoErroRow = {
  index: number;
  nome: string;
  motivo: string;
};

export const acoesService = {
  tableName: 'acoes',

  async ensureConnection(): Promise<void> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  },

  // ============================================================
  // CREATE TABLE
  // ============================================================
  async create(): Promise<void> {
    await this.ensureConnection();
    console.log('>>> [acoesService] create() iniciado');

    const currentDb = await AppDataSource.query('SELECT DATABASE() AS db');
    console.log('>>> [acoesService] banco atual:', currentDb);

    await AppDataSource.query(`
      CREATE TABLE IF NOT EXISTS acoes (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

        nome VARCHAR(55)
          NOT NULL
          COLLATE utf8mb4_general_ci,

        abrev VARCHAR(25)
          NOT NULL
          COLLATE utf8mb4_general_ci,

        cor VARCHAR(20)
          NOT NULL
          COLLATE utf8mb4_general_ci,

        nivel TINYINT UNSIGNED
          NOT NULL,

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

        UNIQUE KEY uk_acoes_nome (nome),
        UNIQUE KEY uk_acoes_abrev (abrev),
        UNIQUE KEY uk_acoes_nivel (nivel)
      )
    `);

    console.log('>>> [acoesService] create() concluído');
  },

  // ============================================================
  // SEED
  // ============================================================
  async seed(): Promise<void> {
    await this.ensureConnection();
    console.log('>>> [acoesService] seed() iniciado');

    const BATCH_SIZE = 50;
    const rows: Array<[string, string, string, number, number, number]> = [];
    const registrosComErro: AcaoErroRow[] = [];

    for (let index = 0; index < acoesSeed.length; index++) {
      const acao = acoesSeed[index] as AcaoSeedRow;

      if (
        !acao.nome ||
        !acao.abrev ||
        !acao.cor ||
        !acao.nivel ||
        acao.nivel < 1 ||
        acao.nivel > 5
      ) {
        const erro: AcaoErroRow = {
          index: index + 1,
          nome: acao.nome ?? '',
          motivo: 'dados inválidos'
        };

        registrosComErro.push(erro);

        console.error(
          `>>> [acoesService][ERRO] registro ${erro.index} | ação: ${erro.nome} | motivo: ${erro.motivo}`
        );

        continue;
      }

      rows.push([
        acao.nome.trim(),
        acao.abrev.trim(),
        acao.cor.trim(),
        acao.nivel,
        acao.createdBy ?? 0,
        acao.updatedBy ?? 0
      ]);
    }

    console.log(`>>> [acoesService] registros válidos: ${rows.length}`);
    console.log(`>>> [acoesService] registros com erro: ${registrosComErro.length}`);

    if (registrosComErro.length > 0) {
      console.table(registrosComErro);
    }

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);

      const placeholders = batch.map(() => '(?, ?, ?, ?, ?, ?)').join(',');
      const values = batch.flat();

      await AppDataSource.query(
        `
        INSERT INTO acoes
          (nome, abrev, cor, nivel, createdBy, updatedBy)
        VALUES ${placeholders}
        ON DUPLICATE KEY UPDATE
          cor = VALUES(cor),
          updatedBy = VALUES(updatedBy),
          updatedAt = CURRENT_TIMESTAMP
        `,
        values
      );

      console.log(
        `>>> [acoesService] lote inserido: ${i + 1} até ${i + batch.length}`
      );
    }

    console.log('>>> [acoesService] seed() concluído');
  },

  // ============================================================
  // COUNT
  // ============================================================
  async count(): Promise<number> {
    await this.ensureConnection();

    const result = await AppDataSource.query(`
      SELECT COUNT(*) AS total
      FROM acoes
    `);

    const total = Number(result?.[0]?.total ?? 0);
    console.log('>>> [acoesService] total de registros:', total);

    return total;
  },

  // ============================================================
  // UPDATE
  // ============================================================
  async update(): Promise<void> {
    // reservado para futuras atualizações
  }
};