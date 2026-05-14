
// C:\repository\proj-full-stack-backend\src\services\table\chaves.service.ts

import { AppDataSource } from '../../config/db';

export const chavesService = {
  tableName: 'chaves',

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

        id_users INT UNSIGNED NOT NULL DEFAULT 0,

        identificador VARCHAR(60)
          NOT NULL
          COLLATE utf8mb4_general_ci,

        psw_hash VARCHAR(255)
          NOT NULL,

        min_hash VARCHAR(255)
          NOT NULL,

        ativo TINYINT(1)
          NOT NULL
          DEFAULT 1,

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

        UNIQUE KEY uk_chaves_identificador_users (identificador, id_users),

        INDEX idx_chaves_identificador (identificador),
        INDEX idx_chaves_id_users (id_users),
        INDEX idx_chaves_identificador_id_users (identificador, id_users),

        CONSTRAINT fk_chaves_users
          FOREIGN KEY (id_users)
          REFERENCES users(id)
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
    console.log(`>>> [${this.tableName}Service] total de registros:`, total);

    return total;
  },

  // ============================================================
  // * UPDATE TABLE *
  // ============================================================
  async update(): Promise<void> {
    // reservado para futuras alterações de estrutura
  }
};