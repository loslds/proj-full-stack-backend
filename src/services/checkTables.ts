// src/services/checkTables.ts
import { requiredTables } from '../config/tables';
import { dbSource } from '../database';
import { SystablesRepository } from '../use-cases/systable/systables.repository';
import { PessoasRepository } from '../use-cases/pessoa/pessoas.repository';
import { EmpresasRepository } from '../use-cases/empresa/empresas.repository';
// adicionar outras tabelas

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
  let syncFailed = false;
  const requiredTablesOff: { nome: string; numberregs: number }[] = [];

  const queryRunner = dbSource.createQueryRunner();

  try {
    await queryRunner.connect();
    steps.push('⏳ Checando existência de tabelas...');
    await delay(500);

    const tables = await queryRunner.query('SHOW TABLES');
    const existingTables = tables.map((t: any) => Object.values(t)[0]);

    const checkedTables: string[] = [];
    const missingTables: string[] = [];

    const tableCreationMap: Record<string, { repoClass: any; createMethod: string }> = {
      systables: { repoClass: SystablesRepository, createMethod: 'createNotExistsSystables' },
      pessoas: { repoClass: PessoasRepository, createMethod: 'createNotExistsPessoas' },
      empresas: { repoClass: EmpresasRepository, createMethod: 'createNotExistsEmpresas' },
      // adicionar outras tabelas
    };

    // 1️⃣ Garantir que 'systables' exista
    try {
      if (!existingTables.includes('systables')) {
        const repo = new SystablesRepository(dbSource);
        await repo.createNotExistsSystables();
        steps.push('✅ systables criada com sucesso.');
        existingTables.push('systables');
      } else {
        steps.push('✅ systables já existe.');
      }
    } catch (err: any) {
      steps.push(`❌ Falha ao criar/verificar systables: ${err.message || err}`);
      console.error('Erro ao criar/verificar systables:', err);
      // Opcional: se quiser abortar a execução se systables não puder ser criada
      // throw err;
    }


    // 2️⃣ Checagem e criação das demais tabelas
    for (const table of requiredTables.filter(t => t !== 'systables')) {
      try {
        let count = 0;
        if (existingTables.includes(table)) {
          if (table === 'pessoas') {
            const repo = new PessoasRepository(dbSource);
            count = (await repo.findPessoasAll({})).length;
          } else if (table === 'empresas') {
            const repo = new EmpresasRepository(dbSource);
            count = (await repo.findEmpresasAll({})).length;
          }
          // adicionar outras tabelas.....
          ////////////////
          steps.push(`✅ ${table} existe. Registros: ${count}`);
        } else if (tableCreationMap[table]) {
          const { repoClass, createMethod } = tableCreationMap[table];
          const repoInstance = new repoClass(dbSource);
          await repoInstance[createMethod]();
          steps.push(`✅ ${table} criada com sucesso.`);
        } else {
          missingTables.push(table);
          steps.push(`❌ Não foi possível criar a tabela ${table}.`);
        }

        requiredTablesOff.push({ nome: table, numberregs: count });
        checkedTables.push(table);
        await delay(400);
      } catch (err: any) {
        missingTables.push(table);
        steps.push(`❌ Falha ao checar/criar ${table}: ${err.message || err}`);
      }
    }

    // 3️⃣ Atualiza/insere resultados na tabela de controle 'systables'
    const systablesRepo = new SystablesRepository(dbSource);

    for (const tbl of requiredTablesOff) {
      try {
        const record = await systablesRepo.findOneNomeSystable(tbl.nome);

        if (record) {
          await systablesRepo.updateSystable(record.id, { chkdb: 1, numberregs: tbl.numberregs });
          steps.push(`⏳ Sincronismo (UPDATE) em ${tbl.nome} concluído. Registros: ${tbl.numberregs}`);
        } else {
          await systablesRepo.createSystable({ nome: tbl.nome, chkdb: 1, numberregs: tbl.numberregs });
          steps.push(`⏳ Sincronismo (INSERT) em ${tbl.nome} concluído. Registros: ${tbl.numberregs}`);
        }

        await delay(400);
      } catch (errInner: any) {
        syncFailed = true;
        steps.push(`❌ Falha no Sincronismo ${tbl.nome}: ${errInner.message || errInner}`);
        console.error(`Erro no sincronismo de ${tbl.nome}:`, errInner);
      }
    }

    const systablesRecords = await systablesRepo.findSystableAll({});

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
