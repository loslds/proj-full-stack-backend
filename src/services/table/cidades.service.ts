
//C:\repository\proj-full-stack-backend\src\services\tables\cidades.service.ts
// src/services/tables/cidades.service.ts

import { AppDataSource } from '../../config/db';
import { cidadesSeed } from './seed/cidades.seed';

type CidadeSeedRow = {
  nome: string;
  id_estados: number;
  createdBy?: number;
  updatedBy?: number;
};

type CidadeErroRow = {
  index: number;
  nome: string;
  id_estados: number | null;
  motivo: string;
};

export const cidadesService = {
  tableName: 'cidades',

  async ensureConnection(): Promise<void> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  },

  async create(): Promise<void> {
    await this.ensureConnection();
    console.log('>>> [cidadesService] create() iniciado');

    const currentDb = await AppDataSource.query('SELECT DATABASE() AS db');
    console.log('>>> [cidadesService] banco atual:', currentDb);

    await AppDataSource.query(`
      CREATE TABLE IF NOT EXISTS cidades (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

        nome VARCHAR(120)
          NOT NULL
          COLLATE utf8mb4_general_ci,

        id_estados INT UNSIGNED
          NOT NULL,

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

        UNIQUE KEY uk_cidades_nome_estado (nome, id_estados),

        CONSTRAINT fk_cidades_estados
          FOREIGN KEY (id_estados) REFERENCES estados(id)
          ON UPDATE CASCADE
          ON DELETE RESTRICT
      )
    `);

    console.log('>>> [cidadesService] create() concluído');
  },

  async seed(): Promise<void> {
    await this.ensureConnection();
    console.log('>>> [cidadesService] seed() iniciado');

    const BATCH_SIZE = 150;
    const rows: Array<[string, number, number, number]> = [];
    const registrosComErro: CidadeErroRow[] = [];

    for (let index = 0; index < cidadesSeed.length; index++) {
      const c = cidadesSeed[index] as CidadeSeedRow;

      if (!c.id_estados || c.id_estados <= 0) {
        const erro: CidadeErroRow = {
          index: index + 1,
          nome: c.nome,
          id_estados: c.id_estados ?? null,
          motivo: 'id_estados inválido'
        };

        registrosComErro.push(erro);

        console.error(
          `>>> [cidadesService][ERRO] registro ${erro.index} | cidade: ${erro.nome} | id_estados: ${erro.id_estados} | motivo: ${erro.motivo}`
        );

        continue;
      }

      rows.push([
        c.nome,
        c.id_estados,
        c.createdBy ?? 0,
        c.updatedBy ?? 0
      ]);
    }

    console.log(`>>> [cidadesService] registros válidos preparados: ${rows.length}`);
    console.log(`>>> [cidadesService] registros com erro: ${registrosComErro.length}`);

    if (registrosComErro.length > 0) {
      console.log('>>> [cidadesService] resumo dos registros com erro:');
      console.table(registrosComErro);
    }

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);

      const placeholders = batch.map(() => '(?, ?, ?, ?)').join(',');
      const values = batch.flat();

      await AppDataSource.query(
        `
        INSERT INTO cidades (nome, id_estados, createdBy, updatedBy)
        VALUES ${placeholders}
        ON DUPLICATE KEY UPDATE
          updatedBy = VALUES(updatedBy),
          updatedAt = CURRENT_TIMESTAMP
        `,
        values
      );

      console.log(
        `>>> [cidadesService] lote inserido: ${i + 1} até ${i + batch.length}`
      );
    }

    console.log('>>> [cidadesService] seed() concluído');
  },

  async count(): Promise<number> {
    await this.ensureConnection();

    const result = await AppDataSource.query(`
      SELECT COUNT(*) AS total
      FROM cidades
    `);

    const total = Number(result?.[0]?.total ?? 0);
    console.log('>>> [cidadesService] total de registros:', total);

    return total;
  },

  async update(): Promise<void> {
    // reservado para futuras atualizações
  },
};