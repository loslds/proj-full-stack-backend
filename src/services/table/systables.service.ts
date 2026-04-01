
// C:\repository\proj-full-stack-backend\src\services\table\systables.service.ts

import { AppDataSource } from '../../config/db';

/**
 * Service exclusivo da tabela systables
 *
 * Responsabilidades:
 * - Criar a estrutura física
 * - Inserir registros iniciais
 * - Sincronizar estado real do banco
 *
 * NÃO cria outras tabelas
 * NÃO executa lógica de negócio
 */
export const systablesService = {
  tableName: 'systables',

  /**
   * Garante que o DataSource esteja inicializado
   */
  async ensureConnection(): Promise<void> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  },

  /**
   * Criação da tabela systables (estrutura física)
   */
  async create(): Promise<void> {
    await this.ensureConnection();

    await AppDataSource.query(`
      CREATE TABLE IF NOT EXISTS systables (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

        nome VARCHAR(60)
          NOT NULL
          COLLATE utf8mb4_general_ci
          UNIQUE,

        chkdb TINYINT UNSIGNED
          NOT NULL
          DEFAULT 0,

        numberregs INT UNSIGNED
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
          ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  },

  /**
   * Contagem de registros
   */
  async count(): Promise<number> {
    await this.ensureConnection();

    const result = await AppDataSource.query(`
      SELECT COUNT(*) AS total
      FROM systables
    `);

    const total = Number(result?.[0]?.total ?? 0);
    console.log('>>> [systablesService] total de registros:', total);

    return total;
  },

  /**
   * Seed inicial
   * (idempotente)
   */
  async seed(tables: readonly string[]): Promise<void> {
    await this.ensureConnection();

    for (const tableName of tables) {
      await AppDataSource.query(
        `
        INSERT IGNORE INTO systables (nome, chkdb, numberregs)
        VALUES (?, 0, 0)
        `,
        [tableName]
      );
    }
  },

  /**
   * Sincroniza a systables com o estado real do banco
   *
   * - garante existência do registro
   * - atualiza chkdb e numberregs
   */
  async sync(tables: readonly string[]): Promise<void> {
    await this.ensureConnection();

    const dbTablesRaw = await AppDataSource.query('SHOW TABLES');
    const dbTables = dbTablesRaw.map(
      (row: Record<string, string>) => String(Object.values(row)[0])
    );

    for (const tableName of tables) {
      const exists = dbTables.includes(tableName);
      let total = 0;

      if (exists) {
        const result = await AppDataSource.query(
          `SELECT COUNT(*) AS total FROM \`${tableName}\``
        );
        total = Number(result?.[0]?.total ?? 0);
      }

      await AppDataSource.query(
        `
        INSERT INTO systables (nome, chkdb, numberregs, createdAt, updatedAt)
        VALUES (?, ?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE
          chkdb = VALUES(chkdb),
          numberregs = VALUES(numberregs),
          updatedAt = NOW()
        `,
        [tableName, exists ? 1 : 0, total]
      );
    }
  },

  /**
   * Reservado para migrações futuras
   */
  async update(): Promise<void> {
    // intencionalmente vazio
  },
};




// // C:\repository\proj-full-stack-backend\src\services\table\systables.service.ts

// import { AppDataSource } from '../../config/db';
 
// /**
//  * Service exclusivo da tabela systables
//  *
//  * Responsabilidades:
//  * - Criar a estrutura física
//  * - Inserir registros iniciais
//  * - Sincronizar estado real do banco
//  *
//  * NÃO cria outras tabelas
//  * NÃO executa lógica de negócio
//  */
 
// export const systablesService = {
//   tableName: 'systables',

//   /**
//    * Garante que o DataSource esteja inicializado
//    */
//   async ensureConnection(): Promise<void> {
//     if (!AppDataSource.isInitialized) {
//       await AppDataSource.initialize();
//     }
//   },

//   /**
//    * Criação da tabela systables (estrutura física)
//    */
//   async create(): Promise<void> {
//     await this.ensureConnection();

//     await AppDataSource.query(`
//       CREATE TABLE IF NOT EXISTS systables (
//         id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

//         nome VARCHAR(60)
//           NOT NULL
//           COLLATE utf8mb4_general_ci
//           UNIQUE,

//         chkdb TINYINT UNSIGNED
//           NOT NULL
//           DEFAULT 0,

//         numberregs INT UNSIGNED
//           NOT NULL
//           DEFAULT 0,

//         createdBy INT UNSIGNED
//           NOT NULL
//           DEFAULT 0,

//         createdAt DATETIME
//           DEFAULT CURRENT_TIMESTAMP,

//         updatedBy INT UNSIGNED
//           NOT NULL
//           DEFAULT 0,

//         updatedAt DATETIME
//           DEFAULT CURRENT_TIMESTAMP
//           ON UPDATE CURRENT_TIMESTAMP
//       )
//     `);
//   },

//   /**
//    * Seed inicial
//    * (idempotente)
//    */
//   async seed(tables: readonly string[]): Promise<void> {
//     await this.ensureConnection();

//     for (const tableName of tables) {
//       await AppDataSource.query(
//         `
//         INSERT IGNORE INTO systables (nome, chkdb, numberregs)
//         VALUES (?, 0, 0)
//         `,
//         [tableName]
//       );
//     }
//   },

//   /**
//    * Sincroniza a systables com o estado real do banco
//    *
//    * - garante existência do registro
//    * - atualiza chkdb e numberregs
//    */
//   async sync(tables: readonly string[]): Promise<void> {
//     await this.ensureConnection();

//     const dbTablesRaw = await AppDataSource.query('SHOW TABLES');
//     const dbTables = dbTablesRaw.map(
//       (row: Record<string, string>) => Object.values(row)[0]
//     );

//     for (const tableName of tables) {
//       const exists = dbTables.includes(tableName);
//       let total = 0;

//       if (exists) {
//         const result = await AppDataSource.query(
//           `SELECT COUNT(*) AS total FROM \`${tableName}\``
//         );
//         total = Number(result?.[0]?.total ?? 0);
//       }

//       await AppDataSource.query(
//         `
//         INSERT INTO systables (nome, chkdb, numberregs, createdAt, updatedAt)
//         VALUES (?, ?, ?, NOW(), NOW())
//         ON DUPLICATE KEY UPDATE
//           chkdb = VALUES(chkdb),
//           numberregs = VALUES(numberregs),
//           updatedAt = NOW()
//         `,
//         [tableName, exists ? 1 : 0, total]
//       );
//     }
//   },

//   /**
//    * Reservado para migrações futuras
//    */
//   async update(): Promise<void> {
//     // intencionalmente vazio
//   },
// };
 