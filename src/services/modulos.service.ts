
// src/services/tables/modulos.service.ts

import { AppDataSource } from '../config/db';
import { modulosSeed } from './tables/seed/modulos.seed';


type ModuloSeedRow = {
  name: string;
  createdBy?: number;
  updatedBy?: number;
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

    for (const modulo of modulosSeed as ModuloSeedRow[]) {
      rows.push([
        modulo.name,
        modulo.createdBy ?? 0,
        modulo.updatedBy ?? 0
      ]);
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

  async update(): Promise<void> {
    // reservado
  }
};