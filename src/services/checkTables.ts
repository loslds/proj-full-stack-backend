// src/services/checkTables.ts
import { requiredTables } from '../config/tables';

import { dbSource } from '../database';

import { systablesConfig } from '../use-cases/systable';
import { pessoasConfig } from '../use-cases/pessoa';
import { imagensConfig } from '../use-cases/imagen';
import { empresasConfig } from '../use-cases/empresa';
import { estadosConfig } from '../use-cases/estado';
import { cidadesConfig } from '../use-cases/cidade';

import { consumidoresConfig } from '../use-cases/consumidor';
import { clientesConfig } from '../use-cases/cliente';
import { fornecedoresConfig } from '../use-cases/fornecedor';
import { funcionariosConfig } from '../use-cases/funcionario';



//import { cadastrosConfig } from '../use-cases/cadastro';


type TableConfig = {
  tableName: string;
  repoClass: any;
  createMethod: string;
  findAll: string;
  insertDefaults?: string; // opcional
};

// 🔹 monta array com todas as configs
const allConfigs: TableConfig[] = [
  systablesConfig, //unico
  pessoasConfig,   // 0 reg.
  imagensConfig,   // 43 reg
  empresasConfig,  // 0 reg.
  estadosConfig,   // 27 reg.
  cidadesConfig,   // 5.615 reg.
  consumidoresConfig, // 0 reg.
  clientesConfig,     // 0 reg.
  fornecedoresConfig, // 0 reg.
  funcionariosConfig  // 0 reg.
  // futuramente outras tabelas
];

// 🔹 cria mapa dinâmico por tableName
const tablesMap: Record<string, TableConfig> = Object.fromEntries(
  allConfigs.map(cfg => [cfg.tableName, cfg])
);

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function checkTables(): Promise<{
  success: boolean;
  missingTables?: string[];
  checkedTables?: string[];
  message: string;
  systablesRecords?: { id: number; nome: string; chkdb: number; numberregs?: number }[];
  steps?: string[];
}> {
  const steps: string[] = [];
  const missingTables: string[] = [];
  const checkedTables: string[] = [];
  const requiredTablesOff: { nome: string; numberregs: number }[] = [];
  let syncFailed = false;

  const queryRunner = dbSource.createQueryRunner();

  try {
    await queryRunner.connect();
    steps.push('⏳ Checando existência de tabelas...');
    await delay(500);

    // pega todas as tabelas existentes no banco
    const tables = await queryRunner.query('SHOW TABLES');
    const existingTables = tables.map((t: any) => Object.values(t)[0]);

    // 🔹 Loop centralizado em cima de requiredTables
    for (const table of requiredTables) {
      try {
        let count = 0;
        const config = tablesMap[table];

        if (!config) {
          missingTables.push(table);
          steps.push(`❌ Nenhuma configuração encontrada para ${table}`);
          continue;
        }

        const repo = new config.repoClass(dbSource);

        // cria tabela se não existir
        if (!existingTables.includes(table)) {
          await repo[config.createMethod]();
          steps.push(`✅ ${table} criada com sucesso.`);
          existingTables.push(table);
        }

        // conta registros existentes
        count = (await repo[config.findAll]({})).length;

        // insere defaults se houver e tabela estiver vazia
        if (count === 0 && config.insertDefaults) {
          await repo[config.insertDefaults]();
          count = (await repo[config.findAll]({})).length;
        }

        steps.push(`✅ ${table} existe. Registros: ${count}`);
        requiredTablesOff.push({ nome: table, numberregs: count });
        checkedTables.push(table);

        await delay(400);
      } catch (err: any) {
        missingTables.push(table);
        steps.push(`❌ Falha ao checar/criar ${table}: ${err.message || err}`);
      }
    }

    // 🔹 Sincroniza com tabela de controle systables
    const systablesRepo = new tablesMap['systables'].repoClass(dbSource);

    for (const tbl of requiredTablesOff) {
      try {
        const record = await systablesRepo.findOneNomeSystables(tbl.nome);
        if (record) {
          await systablesRepo.updateSystables(record.id, {
            chkdb: 1,
            numberregs: tbl.numberregs,
          });
          steps.push(
            `⏳ Sincronismo (UPDATE) em ${tbl.nome} concluído. Registros: ${tbl.numberregs}`
          );
        } else {
          await systablesRepo.createSystables({
            nome: tbl.nome,
            chkdb: 1,
            numberregs: tbl.numberregs,
          });
          steps.push(
            `⏳ Sincronismo (INSERT) em ${tbl.nome} concluído. Registros: ${tbl.numberregs}`
          );
        }
        await delay(400);
      } catch (errInner: any) {
        syncFailed = true;
        steps.push(`❌ Falha no Sincronismo ${tbl.nome}: ${errInner.message || errInner}`);
        console.error(`Erro no sincronismo de ${tbl.nome}:`, errInner);
      }
    }

    const systablesRecords = await systablesRepo.findSystablesAll({});

    return {
      success: missingTables.length === 0 && !syncFailed,
      missingTables: missingTables.length ? missingTables : undefined,
      checkedTables,
      systablesRecords,
      message:
        missingTables.length || syncFailed
          ? `❌ Verificação concluída com problemas.`
          : '✅ Todas as tabelas estão presentes e sincronizadas com sucesso!',
      steps,
    };
  } catch (error: any) {
    console.error('Erro ao verificar tabelas:', error);
    return { success: false, message: `❌ Erro ao verificar tabelas: ${error.message}`, steps };
  } finally {
    await queryRunner.release();
  }
}

