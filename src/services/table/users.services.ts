
//C:\repository\proj-full-stack-backend\src\services\table\users.services.ts

// C:\repository\proj-full-stack-backend\src\services\table\users.service.ts

import { AppDataSource } from '../../config/db';

export const usersService = {
  tableName: 'users',

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

        id_modulos INT UNSIGNED
          NOT NULL
          DEFAULT 0,

        id_cargos INT UNSIGNED
          NOT NULL
          DEFAULT 0,

        id_acoes INT UNSIGNED
          NOT NULL
          DEFAULT 0,

        is_active TINYINT(1)
          NOT NULL
          DEFAULT 1,

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

        UNIQUE KEY uk_users_id_cadastros (
          id_cadastros
        ),

        INDEX idx_users_id_cadastros (
          id_cadastros
        ),

        INDEX idx_users_id_modulos (
          id_modulos
        ),

        INDEX idx_users_id_cargos (
          id_cargos
        ),

        INDEX idx_users_id_acoes (
          id_acoes
        ),

        INDEX idx_users_is_active (
          is_active
        ),

        CONSTRAINT fk_users_cadastros
          FOREIGN KEY (id_cadastros)
          REFERENCES cadastros(id)
          ON DELETE RESTRICT
          ON UPDATE CASCADE,

        CONSTRAINT fk_users_modulos
          FOREIGN KEY (id_modulos)
          REFERENCES modulos(id)
          ON DELETE RESTRICT
          ON UPDATE CASCADE,

        CONSTRAINT fk_users_cargos
          FOREIGN KEY (id_cargos)
          REFERENCES cargos(id)
          ON DELETE RESTRICT
          ON UPDATE CASCADE,

        CONSTRAINT fk_users_acoes
          FOREIGN KEY (id_acoes)
          REFERENCES acoes(id)
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