// C:\repository\proj-full-stack-backend\src\services\table\arquivados.service.ts

import { AppDataSource } from '../../config/db';

let createLogged = false;
let countLogged = false;

export const arquivadosService = {
  tableName: 'arquivados',

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

    if (!createLogged) {
      createLogged = true;
    }

    await AppDataSource.query('SELECT DATABASE() AS db');

    // id_users sem FK de propósito: o histórico não depende de o users
    // continuar existindo.
    await AppDataSource.query(`
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

        tab_origem VARCHAR(30)
          NOT NULL
          COLLATE utf8mb4_general_ci,

        id_origem INT UNSIGNED NOT NULL DEFAULT 0,

        dataorigem DATETIME NULL,

        id_destino INT UNSIGNED NOT NULL DEFAULT 0,

        tab_destino VARCHAR(30)
          NOT NULL
          DEFAULT ''
          COLLATE utf8mb4_general_ci,

        motivo VARCHAR(30)
          NOT NULL
          DEFAULT ''
          COLLATE utf8mb4_general_ci,

        id_users INT UNSIGNED NOT NULL DEFAULT 0,

        nomeusers VARCHAR(60)
          NOT NULL
          DEFAULT ''
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

        INDEX idx_arquivados_origem (tab_origem, id_origem),
        INDEX idx_arquivados_destino (tab_destino, id_destino),
        INDEX idx_arquivados_id_users (id_users)
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
