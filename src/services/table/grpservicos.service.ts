
// C:\repository\proj-full-stack-backend\src\services\table\grpservicos.service.ts

import { AppDataSource } from '../../config/db';
import { grpservicosSeed } from './seed/grpservicos.seed';

let createLogged = false;
let countLogged = false;

export const grpservicosService = {
  tableName: 'grpservicos',

  async ensureConnection(): Promise<void> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  },

  async create(): Promise<void> {
    await this.ensureConnection();

    if (!createLogged) {
      // console.log(`>>> Iniciado "Grpservicos" em [${this.tableName}]`);
      createLogged = true;
    }

    await AppDataSource.query(`
      CREATE TABLE IF NOT EXISTS grpservicos (
        id INT UNSIGNED
          NOT NULL
          AUTO_INCREMENT,

        id_servicos INT UNSIGNED
          NOT NULL,

        nome VARCHAR(150)
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

        UNIQUE KEY uk_grpservicos_nome_servico (
          nome,
          id_servicos
        ),

        KEY idx_grpservicos_nome (nome),

        KEY idx_grpservicos_id_servicos (
          id_servicos
        ),

        CONSTRAINT fk_grpservicos_servicos
          FOREIGN KEY (id_servicos)
          REFERENCES servicos(id)
          ON UPDATE CASCADE
          ON DELETE RESTRICT
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
      FROM grpservicos
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

    for (const g of grpservicosSeed) {
      await AppDataSource.query(
        `
        INSERT INTO grpservicos (
          id,
          id_servicos,
          nome,
          createdBy,
          updatedBy
        )
        VALUES (?, ?, ?, ?, ?)

        ON DUPLICATE KEY UPDATE
          id_servicos = VALUES(id_servicos),
          nome = VALUES(nome),
          updatedBy = VALUES(updatedBy),
          updatedAt = CURRENT_TIMESTAMP
        `,
        [
          g.id,
          g.id_servicos,
          g.nome,
          g.createdBy ?? 0,
          g.updatedBy ?? 0
        ]
      );
    }
  },

  async update(): Promise<void> {
    // reservado
  },
};
