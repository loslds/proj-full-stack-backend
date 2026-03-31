
// C:\repository\proj-full-stack-backend\src\services\table\fones.service.ts
import { AppDataSource } from '../../config/db';

export const fonesService = {
  tableName: 'fones',

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

        fone_fixo VARCHAR(10)
          DEFAULT NULL
          COLLATE utf8mb4_general_ci,

        fone_celular VARCHAR(10)
          DEFAULT NULL
          COLLATE utf8mb4_general_ci,

        fone_contacto VARCHAR(10)
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

        UNIQUE KEY uk_fones_fone_fixo (fone_fixo),
        UNIQUE KEY uk_fones_fone_celular (fone_celular),

        INDEX idx_fones_id_cadastros (id_cadastros),
        INDEX idx_fones_fone_fixo (fone_fixo),
        INDEX idx_fones_fone_celular (fone_celular),
        INDEX idx_fones_fone_contacto (fone_contacto),

        CONSTRAINT fk_fones_cadastros
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

