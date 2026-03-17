
//C:\repository\proj-full-stack-backend\src\services\table\perguntas.service.ts
// C:\repository\proj-full-stack-backend\src\services\table\perguntas.service.ts

import { AppDataSource } from '../../config/db';
import { perguntasSeed } from './seed/perguntas.seed';

type PerguntaSeedRow = {
  nome: string;
  createdBy?: number;
  updatedBy?: number;
};

type PerguntaErroRow = {
  index: number;
  nome: string;
  motivo: string;
};

export const perguntasService = {
  tableName: 'perguntas',

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
    console.log('>>> [perguntasService] create() iniciado');

    const currentDb = await AppDataSource.query('SELECT DATABASE() AS db');
    console.log('>>> [perguntasService] banco atual:', currentDb);

    await AppDataSource.query(`
      CREATE TABLE IF NOT EXISTS perguntas (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

        nome VARCHAR(255)
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

        UNIQUE KEY uk_perguntas_nome (nome)
      )
    `);

    console.log('>>> [perguntasService] create() concluído');
  },

  // ============================================================
  // SEED
  // ============================================================
  async seed(): Promise<void> {
    await this.ensureConnection();
    console.log('>>> [perguntasService] seed() iniciado');

    const BATCH_SIZE = 50;
    const rows: Array<[string, number, number]> = [];
    const registrosComErro: PerguntaErroRow[] = [];

    for (let index = 0; index < perguntasSeed.length; index++) {
      const pergunta = perguntasSeed[index] as PerguntaSeedRow;

      if (!pergunta.nome || pergunta.nome.trim().length < 3) {
        const erro: PerguntaErroRow = {
          index: index + 1,
          nome: pergunta.nome ?? '',
          motivo: 'nome inválido'
        };

        registrosComErro.push(erro);

        console.error(
          `>>> [perguntasService][ERRO] registro ${erro.index} | pergunta: ${erro.nome} | motivo: ${erro.motivo}`
        );

        continue;
      }

      rows.push([
        pergunta.nome.trim(),
        pergunta.createdBy ?? 0,
        pergunta.updatedBy ?? 0
      ]);
    }

    console.log(`>>> [perguntasService] registros válidos preparados: ${rows.length}`);
    console.log(`>>> [perguntasService] registros com erro: ${registrosComErro.length}`);

    if (registrosComErro.length > 0) {
      console.log('>>> [perguntasService] resumo dos registros com erro:');
      console.table(registrosComErro);
    }

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);

      const placeholders = batch.map(() => '(?, ?, ?)').join(',');
      const values = batch.flat();

      await AppDataSource.query(
        `
        INSERT INTO perguntas (nome, createdBy, updatedBy)
        VALUES ${placeholders}
        ON DUPLICATE KEY UPDATE
          updatedBy = VALUES(updatedBy),
          updatedAt = CURRENT_TIMESTAMP
        `,
        values
      );

      console.log(
        `>>> [perguntasService] lote inserido: ${i + 1} até ${i + batch.length}`
      );
    }

    console.log('>>> [perguntasService] seed() concluído');
  },

  // ============================================================
  // COUNT
  // ============================================================
  async count(): Promise<number> {
    await this.ensureConnection();

    const result = await AppDataSource.query(`
      SELECT COUNT(*) AS total
      FROM perguntas
    `);

    const total = Number(result?.[0]?.total ?? 0);
    console.log('>>> [perguntasService] total de registros:', total);

    return total;
  },

  // ============================================================
  // UPDATE
  // ============================================================
  async update(): Promise<void> {
    // reservado para futuras atualizações
  }
};