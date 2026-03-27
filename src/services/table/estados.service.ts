// src/services/tables/estados.service.ts
import { AppDataSource } from '../../config/db';
import { estadosSeed } from './seed/estados.seed';

export const estadosService = {
  tableName: 'estados',

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

        nome VARCHAR(60)
          NOT NULL
          COLLATE utf8mb4_general_ci,

        prefixo VARCHAR(5)
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

        UNIQUE KEY uk_estados_nome_prefixo (nome, prefixo)
      )
    `);

    console.log(`>>> [${this.tableName}Service] create() concluído`);
  },
  // ============================================================
  // * SEED *
  // ============================================================
  async seed(): Promise<void> {
    await this.ensureConnection();
    console.log(`>>> [${this.tableName}Service] seed() iniciado`);

    for (const { nome, prefixo, createdBy, updatedBy } of estadosSeed) {
      console.log(`>>> [${this.tableName}Service] inserindo registro:`, {
        nome,
        prefixo,
        createdBy,
        updatedBy
      });

      await AppDataSource.query(
        `
        INSERT INTO ${this.tableName} (nome, prefixo, createdBy, updatedBy)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          updatedBy = VALUES(updatedBy),
          updatedAt = CURRENT_TIMESTAMP
        `,
        [nome, prefixo, createdBy ?? 0, updatedBy ?? 0]
      );
    }

    console.log(`>>> [${this.tableName}Service] seed() concluído`);
  },

  // ============================================================
  // * UPDATE TABLE *
  // ============================================================

  async update(): Promise<void> {
    // reservado
  }
};