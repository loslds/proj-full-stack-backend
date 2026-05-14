
// C:\repository\proj-full-stack-backend\src\services\table\pergsresps.service.ts

import { AppDataSource } from '../../config/db';

export const pergsrespsService = {
  tableName: 'pergsresps',

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
    console.log(`>>> [${this.tableName}Service] create() iniciado`);

    const currentDb = await AppDataSource.query('SELECT DATABASE() AS db');
    console.log(`>>> [${this.tableName}Service] banco atual:`, currentDb);

    await AppDataSource.query(`
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

        id_chaves INT UNSIGNED NOT NULL DEFAULT 0,

        pergunta1 VARCHAR(120)
          NOT NULL
          COLLATE utf8mb4_general_ci,

        resposta1 VARCHAR(120)
          NOT NULL
          COLLATE utf8mb4_general_ci,

        pergunta2 VARCHAR(120)
          NOT NULL
          COLLATE utf8mb4_general_ci,

        resposta2 VARCHAR(120)
          NOT NULL
          COLLATE utf8mb4_general_ci,

        pergunta3 VARCHAR(120)
          NOT NULL
          COLLATE utf8mb4_general_ci,

        resposta3 VARCHAR(120)
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

        UNIQUE KEY uk_pergsresps_id_chaves (id_chaves),

        INDEX idx_pergsresps_id_chaves (id_chaves),

        CONSTRAINT fk_pergsresps_chaves
          FOREIGN KEY (id_chaves)
          REFERENCES chaves(id)
          ON DELETE RESTRICT
          ON UPDATE CASCADE
      )
    `);

    console.log(`>>> [${this.tableName}Service] create() concluído`);
  },

  // ============================================================
  // * COUNT *
  // ============================================================
  async count(): Promise<number> {
    await this.ensureConnection();

    const result = await AppDataSource.query(`
      SELECT COUNT(*) AS total
      FROM ${this.tableName}
    `);

    const total = Number(result?.[0]?.total ?? 0);

    console.log(
      `>>> [${this.tableName}Service] total de registros:`,
      total
    );

    return total;
  },

  // ============================================================
  // * UPDATE TABLE *
  // ============================================================
  async update(): Promise<void> {
    // reservado para futuras alterações de estrutura
  }
};