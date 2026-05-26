
// C:\repository\proj-full-stack-backend\src\services\table\empresas.service.ts

import { AppDataSource } from '../../config/db';

let createLogged = false;
let countLogged = false;

export const empresasService = {
  tableName: 'empresas',

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
    
    if (!createLogged) {// console.log(`>>> [${this.tableName}Service] Iniciado`);
      createLogged = true;
    }

    const currentDb = await AppDataSource.query('SELECT DATABASE() AS db');

    await AppDataSource.query(`
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

        id_pessoas INT UNSIGNED NOT NULL DEFAULT 0,

        nome VARCHAR(60)
          NOT NULL
          COLLATE utf8mb4_general_ci,

        fantasy VARCHAR(60)
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

        UNIQUE KEY uk_empresas_nome_fantasy_pessoa (nome, fantasy, id_pessoas),

        INDEX idx_empresas_nome (nome),
        INDEX idx_empresas_fantasy (fantasy),
        INDEX idx_empresas_id_pessoas (id_pessoas),

        CONSTRAINT fk_empresas_pessoas
          FOREIGN KEY (id_pessoas)
          REFERENCES pessoas(id)
          ON DELETE RESTRICT
          ON UPDATE CASCADE
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
      FROM ${this.tableName}
    `);

    const total = Number(result?.[0]?.total ?? 0);

    if (!countLogged) {
      console.log(`>>> [${this.tableName}Service] total de registros:`, total);
      countLogged = true;
    }

    return total;
  },

  // ============================================================
  // * UPDATE TABLE *
  // ============================================================
  async update(): Promise<void> {
    // reservado para futuras alterações de estrutura
  }
};