// C:\repository\proj-full-stack-backend\src\services\table\servicos.service.ts

import { AppDataSource } from '../../config/db';
import { servicosSeed } from './seed/servicos.seed';

let createLogged = false;
let countLogged = false;

export const servicosService = {
  tableName: 'servicos',

  async ensureConnection(): Promise<void> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  },

  async create(): Promise<void> {
    await this.ensureConnection();

    if (!createLogged) {
      // console.log(`>>> Iniciado "Serviços" em [${this.tableName}]`);
      createLogged = true;
    }

    await AppDataSource.query(`
      CREATE TABLE IF NOT EXISTS servicos (
        id INT UNSIGNED
          NOT NULL
          AUTO_INCREMENT,

        nome VARCHAR(100)
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

        PRIMARY KEY (id),

        UNIQUE KEY uk_servicos_nome (nome),

        KEY idx_servicos_nome (nome)
      )
      ENGINE=InnoDB
      DEFAULT CHARSET=utf8mb4
      COLLATE=utf8mb4_general_ci
    `);
  },

  async count(): Promise<number> {
    await this.ensureConnection();

    const result = await AppDataSource.query(`
      SELECT COUNT(*) AS total
      FROM servicos
    `);

    const total = Number(
      result?.[0]?.total ?? 0
    );

    if (!countLogged) {
      console.log(
        `>>> [${this.tableName}Service] total de registros:`,
        total
      );

      countLogged = true;
    }

    return total;
  },

  async seed(): Promise<void> {
    await this.ensureConnection();

    for (const s of servicosSeed) {
      await AppDataSource.query(
        `
        INSERT INTO servicos (
          id,
          nome,
          createdBy,
          updatedBy
        )
        VALUES (?, ?, ?, ?)

        ON DUPLICATE KEY UPDATE
          nome = VALUES(nome),
          updatedBy = VALUES(updatedBy),
          updatedAt = CURRENT_TIMESTAMP
        `,
        [
          s.id,
          s.nome,
          s.createdBy ?? 0,
          s.updatedBy ?? 0
        ]
      );
    }
  },

  async update(): Promise<void> {
    // reservado
  },
};