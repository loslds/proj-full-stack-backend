// src/services/tables/pessoas.service.ts
import { AppDataSource } from '../../config/db';
import { pessoasSeed } from './seed/pessoas.seed';

export const pessoasService = {
  tableName: 'pessoas',

  async ensureConnection(): Promise<void> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  },

  async create(): Promise<void> {
    await this.ensureConnection();
    console.log('>>> [pessoasService] create() iniciado');

    const currentDb = await AppDataSource.query('SELECT DATABASE() AS db');
    console.log('>>> [pessoasService] banco atual:', currentDb);

    await AppDataSource.query(`
      CREATE TABLE IF NOT EXISTS pessoas (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

        nome VARCHAR(60)
          NOT NULL
          COLLATE utf8mb4_general_ci,

        sigla VARCHAR(5)
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

        UNIQUE KEY uk_pessoas_nome_sigla (nome, sigla)
      )
    `);

    console.log('>>> [pessoasService] create() concluído');
  },

  async seed(): Promise<void> {
    await this.ensureConnection();
    console.log('>>> [pessoasService] seed() iniciado');

    for (const p of pessoasSeed) {
      console.log('>>> [pessoasService] inserindo registro:', p);

      await AppDataSource.query(
        `
        INSERT INTO pessoas (nome, sigla, createdBy, updatedBy)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          updatedBy = VALUES(updatedBy),
          updatedAt = CURRENT_TIMESTAMP
        `,
        [p.nome, p.sigla, p.createdBy ?? 0, p.updatedBy ?? 0]
      );
    }

    console.log('>>> [pessoasService] seed() concluído');
  },

  async update(): Promise<void> {
    // reservado
  },
};