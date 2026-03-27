
//C:\repository\proj-full-stack-backend\src\services\table\cadastros.service.ts
// C:\repository\proj-full-stack-backend\src\services\table\cadastros.service.ts
import { AppDataSource } from '../../config/db';

export const cadastrosService = {
  tableName: 'cadastros',

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
        id_visitantes INT UNSIGNED NOT NULL DEFAULT 0,
        id_consumidores INT UNSIGNED NOT NULL DEFAULT 0,
        id_clientes INT UNSIGNED NOT NULL DEFAULT 0,
        id_fornecedores INT UNSIGNED NOT NULL DEFAULT 0,
        id_funcionarios INT UNSIGNED NOT NULL DEFAULT 0,

        id_cidades INT UNSIGNED NOT NULL DEFAULT 0,
        id_imagens INT UNSIGNED NOT NULL DEFAULT 0,

        endereco VARCHAR(200)
          DEFAULT NULL
          COLLATE utf8mb4_general_ci,

        complemento VARCHAR(200)
          DEFAULT NULL
          COLLATE utf8mb4_general_ci,

        bairro VARCHAR(100)
          DEFAULT NULL
          COLLATE utf8mb4_general_ci,

        cep VARCHAR(8)
          DEFAULT NULL
          COLLATE utf8mb4_general_ci,

        has_email TINYINT(1)
          NOT NULL
          DEFAULT 0,

        has_doc TINYINT(1)
          NOT NULL
          DEFAULT 0,

        has_fone TINYINT(1)
          NOT NULL
          DEFAULT 0,

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

        INDEX idx_cadastros_id_empresas (id_empresas),
        INDEX idx_cadastros_id_visitantes (id_visitantes),
        INDEX idx_cadastros_id_consumidores (id_consumidores),
        INDEX idx_cadastros_id_clientes (id_clientes),
        INDEX idx_cadastros_id_fornecedores (id_fornecedores),
        INDEX idx_cadastros_id_funcionarios (id_funcionarios),
        INDEX idx_cadastros_id_cidades (id_cidades),
        INDEX idx_cadastros_id_imagens (id_imagens),
        INDEX idx_cadastros_cep (cep),

        CONSTRAINT fk_cadastros_empresas
          FOREIGN KEY (id_empresas)
          REFERENCES empresas(id)
          ON DELETE RESTRICT
          ON UPDATE CASCADE,

        CONSTRAINT fk_cadastros_visitantes
          FOREIGN KEY (id_visitantes)
          REFERENCES visitantes(id)
          ON DELETE RESTRICT
          ON UPDATE CASCADE,

        CONSTRAINT fk_cadastros_consumidores
          FOREIGN KEY (id_consumidores)
          REFERENCES consumidores(id)
          ON DELETE RESTRICT
          ON UPDATE CASCADE,

        CONSTRAINT fk_cadastros_clientes
          FOREIGN KEY (id_clientes)
          REFERENCES clientes(id)
          ON DELETE RESTRICT
          ON UPDATE CASCADE,

        CONSTRAINT fk_cadastros_fornecedores
          FOREIGN KEY (id_fornecedores)
          REFERENCES fornecedores(id)
          ON DELETE RESTRICT
          ON UPDATE CASCADE,

        CONSTRAINT fk_cadastros_funcionarios
          FOREIGN KEY (id_funcionarios)
          REFERENCES funcionarios(id)
          ON DELETE RESTRICT
          ON UPDATE CASCADE,

        CONSTRAINT fk_cadastros_cidades
          FOREIGN KEY (id_cidades)
          REFERENCES cidades(id)
          ON DELETE RESTRICT
          ON UPDATE CASCADE,

        CONSTRAINT fk_cadastros_imagens
          FOREIGN KEY (id_imagens)
          REFERENCES imagens(id)
          ON DELETE SET NULL
          ON UPDATE CASCADE,

        CONSTRAINT chk_cadastros_origem_unica CHECK (
          (CASE WHEN id_empresas > 0 THEN 1 ELSE 0 END) +
          (CASE WHEN id_visitantes > 0 THEN 1 ELSE 0 END) +
          (CASE WHEN id_consumidores > 0 THEN 1 ELSE 0 END) +
          (CASE WHEN id_clientes > 0 THEN 1 ELSE 0 END) +
          (CASE WHEN id_fornecedores > 0 THEN 1 ELSE 0 END) +
          (CASE WHEN id_funcionarios > 0 THEN 1 ELSE 0 END) = 1
        )
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

