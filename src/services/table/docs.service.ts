

// C:\repository\proj-full-stack-backend\src\services\table\docs.service.ts
import { AppDataSource } from '../../config/db';

export const docsService = {
  tableName: 'docs',

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

        id_cadastros INT UNSIGNED
          NOT NULL
          DEFAULT 0,

        cpf VARCHAR(14)
          DEFAULT NULL
          COLLATE utf8mb4_general_ci,

        cnpj VARCHAR(18)
          DEFAULT NULL
          COLLATE utf8mb4_general_ci,

        inscr_estadual VARCHAR(20)
          DEFAULT NULL
          COLLATE utf8mb4_general_ci,

        inscr_municipal VARCHAR(20)
          DEFAULT NULL
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

        UNIQUE KEY uk_docs_cpf (cpf),
        UNIQUE KEY uk_docs_cnpj (cnpj),
        UNIQUE KEY uk_docs_inscr_estadual (inscr_estadual),
        UNIQUE KEY uk_docs_inscr_municipal (inscr_municipal),

        INDEX idx_docs_id_cadastros (id_cadastros),
        INDEX idx_docs_cpf (cpf),
        INDEX idx_docs_cnpj (cnpj),
        INDEX idx_docs_inscr_estadual (inscr_estadual),
        INDEX idx_docs_inscr_municipal (inscr_municipal),

        CONSTRAINT fk_docs_cadastros
          FOREIGN KEY (id_cadastros)
          REFERENCES cadastros(id)
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