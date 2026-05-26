

//C:\repository\proj-full-stack-backend\src\services\table\visitas.services.ts

import { AppDataSource } from '../../config/db';

let createLogged = false;
let countLogged = false;

export const visitasService = {
  tableName: 'visitas',

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

        id_visitantes INT UNSIGNED
          NOT NULL
          DEFAULT 0,

        tempo_visita INT UNSIGNED
          NOT NULL
          DEFAULT 0,

        saidaAt DATETIME
          DEFAULT NULL,

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

        INDEX idx_visitas_id_visitantes (id_visitantes),
        INDEX idx_visitas_saidaAt (saidaAt),

        CONSTRAINT fk_visitas_visitantes
          FOREIGN KEY (id_visitantes)
          REFERENCES visitantes(id)
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