
//C:\repository\proj-full-stack-backend\src\services\table\funcionarios.services.ts

// C:\repository\proj-full-stack-backend\src\services\table\funcionarios.service.ts
import { AppDataSource } from '../../config/db';

export const funcionariosService = {
  tableName: 'funcionarios',

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

        id_empresas INT UNSIGNED NOT NULL DEFAULT 0,
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

        UNIQUE KEY uk_funcionarios_nome_fantasy_pessoa_empresa (nome, fantasy, id_pessoas, id_empresas),

        INDEX idx_funcionarios_nome (nome),
        INDEX idx_funcionarios_fantasy (fantasy),
        INDEX idx_funcionarios_id_pessoas (id_pessoas),
        INDEX idx_funcionarios_id_empresas (id_empresas),

        CONSTRAINT fk_funcionarios_empresas
          FOREIGN KEY (id_empresas)
          REFERENCES empresas(id)
          ON DELETE RESTRICT
          ON UPDATE CASCADE,

        CONSTRAINT fk_funcionarios_pessoas
          FOREIGN KEY (id_pessoas)
          REFERENCES pessoas(id)
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

