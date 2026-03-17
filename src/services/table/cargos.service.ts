
//C:\repository\proj-full-stack-backend\src\services\table\cargos.service.ts
import { AppDataSource } from '../../config/db';
import { cargosSeed } from './seed/cargos.seed';

type CargoSeedRow = {
  nome: string;
  createdBy?: number;
  updatedBy?: number;
};

type CargoErroRow = {
  index: number;
  nome: string;
  motivo: string;
};

export const cargosService = {
  tableName: 'cargos',

  async ensureConnection(): Promise<void> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  },

  // ============================================================
  // CREATE TABLE
  // ============================================================
  async create(): Promise<void> {
    await this.ensureConnection();
    console.log('>>> [cargosService] create() iniciado');

    const currentDb = await AppDataSource.query('SELECT DATABASE() AS db');
    console.log('>>> [cargosService] banco atual:', currentDb);

    await AppDataSource.query(`
      CREATE TABLE IF NOT EXISTS cargos (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

        nome VARCHAR(25)
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

        UNIQUE KEY uk_cargos_nome (nome)
      )
    `);

    console.log('>>> [cargosService] create() concluído');
  },

  // ============================================================
  // SEED
  // ============================================================
  async seed(): Promise<void> {
    await this.ensureConnection();
    console.log('>>> [cargosService] seed() iniciado');

    const BATCH_SIZE = 50;
    const rows: Array<[string, number, number]> = [];
    const registrosComErro: CargoErroRow[] = [];

    for (let index = 0; index < cargosSeed.length; index++) {
      const cargo = cargosSeed[index] as CargoSeedRow;

      if (!cargo.nome || cargo.nome.trim().length < 3) {
        const erro: CargoErroRow = {
          index: index + 1,
          nome: cargo.nome ?? '',
          motivo: 'nome inválido'
        };

        registrosComErro.push(erro);

        console.error(
          `>>> [cargosService][ERRO] registro ${erro.index} | cargo: ${erro.nome} | motivo: ${erro.motivo}`
        );

        continue;
      }

      rows.push([
        cargo.nome.trim(),
        cargo.createdBy ?? 0,
        cargo.updatedBy ?? 0
      ]);
    }

    console.log(`>>> [cargosService] registros válidos preparados: ${rows.length}`);
    console.log(`>>> [cargosService] registros com erro: ${registrosComErro.length}`);

    if (registrosComErro.length > 0) {
      console.log('>>> [cargosService] resumo dos registros com erro:');
      console.table(registrosComErro);
    }

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);

      const placeholders = batch.map(() => '(?, ?, ?)').join(',');
      const values = batch.flat();

      await AppDataSource.query(
        `
        INSERT INTO cargos (nome, createdBy, updatedBy)
        VALUES ${placeholders}
        ON DUPLICATE KEY UPDATE
          updatedBy = VALUES(updatedBy),
          updatedAt = CURRENT_TIMESTAMP
        `,
        values
      );

      console.log(
        `>>> [cargosService] lote inserido: ${i + 1} até ${i + batch.length}`
      );
    }

    console.log('>>> [cargosService] seed() concluído');
  },

  // ============================================================
  // COUNT
  // ============================================================
  async count(): Promise<number> {
    await this.ensureConnection();

    const result = await AppDataSource.query(`
      SELECT COUNT(*) AS total
      FROM cargos
    `);

    const total = Number(result?.[0]?.total ?? 0);
    console.log('>>> [cargosService] total de registros:', total);

    return total;
  },

  // ============================================================
  // UPDATE
  // ============================================================
  async update(): Promise<void> {
    // reservado para futuras atualizações
  }
};