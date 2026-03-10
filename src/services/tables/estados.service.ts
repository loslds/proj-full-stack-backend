
// src/services/tables/estados.service.ts
import { AppDataSource } from '../../config/db';
import { estadosSeed } from './seed/estados.seed';

export const estadosService = {
  tableName: 'estados',

  async ensureConnection(): Promise<void> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  },

  async create(): Promise<void> {
    await this.ensureConnection();
    console.log('>>> [estadosService] create() iniciado');

    const currentDb = await AppDataSource.query('SELECT DATABASE() AS db');
    console.log('>>> [estadosService] banco atual:', currentDb);

    await AppDataSource.query(`
      CREATE TABLE IF NOT EXISTS estados (
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

    console.log('>>> [estadosService] create() concluído');
  },

  async seed(): Promise<void> {
    await this.ensureConnection();
    console.log('>>> [estadosService] seed() iniciado');

    for (const p of estadosSeed) {
      console.log('>>> [estadosService] inserindo registro:', p);

      await AppDataSource.query(
        `
        INSERT INTO estados (nome, prefixo, createdBy, updatedBy)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          updatedBy = VALUES(updatedBy),
          updatedAt = CURRENT_TIMESTAMP
        `,
        [p.nome, p.prefixo, p.createdBy ?? 0, p.updatedBy ?? 0]
      );
    }

    console.log('>>> [estadosService] seed() concluído');
  },

  async update(): Promise<void> {
    // reservado
  },
};

