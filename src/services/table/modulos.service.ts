
//C:\repository\proj-full-stack-backend\src\services\table\modulos.service.ts

import { AppDataSource } from '../../config/db';
import { modulosSeed } from './seed/modulos.seed';

type ModuloSeedRow = {
  name: string;
  createdBy?: number;
  updatedBy?: number;
};

type ModuloErroRow = {
  index: number;
  name: string;
  motivo: string;
};

export const modulosService = {
  tableName: 'modulos',

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
    console.log('>>> [modulosService] create() iniciado');

    const currentDb = await AppDataSource.query('SELECT DATABASE() AS db');
    console.log('>>> [modulosService] banco atual:', currentDb);

    await AppDataSource.query(`
      CREATE TABLE IF NOT EXISTS modulos (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

        name VARCHAR(30)
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

        UNIQUE KEY uk_modulos_name (name)
      )
    `);

    console.log('>>> [modulosService] create() concluído');
  },

  // ============================================================
  // SEED
  // ============================================================
  async seed(): Promise<void> {
    await this.ensureConnection();
    console.log('>>> [modulosService] seed() iniciado');

    const BATCH_SIZE = 50;
    const rows: Array<[string, number, number]> = [];
    const registrosComErro: ModuloErroRow[] = [];

    for (let index = 0; index < modulosSeed.length; index++) {
      const modulo = modulosSeed[index] as ModuloSeedRow;

      if (!modulo.name || modulo.name.trim().length < 3) {
        const erro: ModuloErroRow = {
          index: index + 1,
          name: modulo.name ?? '',
          motivo: 'name inválido'
        };

        registrosComErro.push(erro);

        console.error(
          `>>> [modulosService][ERRO] registro ${erro.index} | módulo: ${erro.name} | motivo: ${erro.motivo}`
        );

        continue;
      }

      rows.push([
        modulo.name.trim(),
        modulo.createdBy ?? 0,
        modulo.updatedBy ?? 0
      ]);
    }

    console.log(`>>> [modulosService] registros válidos preparados: ${rows.length}`);
    console.log(`>>> [modulosService] registros com erro: ${registrosComErro.length}`);

    if (registrosComErro.length > 0) {
      console.log('>>> [modulosService] resumo dos registros com erro:');
      console.table(registrosComErro);
    }

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);

      const placeholders = batch.map(() => '(?, ?, ?)').join(',');
      const values = batch.flat();

      await AppDataSource.query(
        `
        INSERT INTO modulos (name, createdBy, updatedBy)
        VALUES ${placeholders}
        ON DUPLICATE KEY UPDATE
          updatedBy = VALUES(updatedBy),
          updatedAt = CURRENT_TIMESTAMP
        `,
        values
      );

      console.log(
        `>>> [modulosService] lote inserido: ${i + 1} até ${i + batch.length}`
      );
    }

    console.log('>>> [modulosService] seed() concluído');
  },

  // ============================================================
  // COUNT
  // ============================================================
  async count(): Promise<number> {
    await this.ensureConnection();

    const result = await AppDataSource.query(`
      SELECT COUNT(*) AS total
      FROM modulos
    `);

    const total = Number(result?.[0]?.total ?? 0);
    console.log('>>> [modulosService] total de registros:', total);

    return total;
  },

  // ============================================================
  // UPDATE
  // ============================================================
  async update(): Promise<void> {
    // reservado para futuras atualizações
  }
};