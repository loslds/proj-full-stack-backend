 
// src/services/checkTables.ts
import { requiredTables } from '../config/tables';
import { dbSource } from '../database';
import { SystablesRepository } from '../use-cases/systable/systables.repository';
import { PessoasRepository } from '../use-cases/pessoa/pessoas.repository';
import { EmpresasRepository } from '../use-cases/empresa/empresas.repository';

export async function checkTables(): Promise<{
  success: boolean;
  missingTables?: string[];
  checkedTables?: string[];
  message: string;
  systablesRecords?: { id: number; nome: string; chkdb: number; numberregs?: number }[];
}> {
  try {
    const queryRunner = dbSource.createQueryRunner();
    await queryRunner.connect();

    // Buscar todas as tabelas existentes no banco
    const tables = await queryRunner.query('SHOW TABLES');
    const existingTables = tables.map((table: any) => Object.values(table)[0]);

    let missingTables = requiredTables.filter(t => !existingTables.includes(t));
    const checkedTables = requiredTables.filter(t => existingTables.includes(t));

    // Map para criação dinâmica de tabelas
    const tableCreationMap: Record<
      string,
      { repoClass: any; createMethod: string }
    > = {
      systables: { repoClass: SystablesRepository, createMethod: 'createNotExistsSystables' },
      pessoas: { repoClass: PessoasRepository, createMethod: 'createNotExistsPessoas' },
      empresas: { repoClass: EmpresasRepository, createMethod: 'createNotExistsEmpresas' },
    };

    // Criar tabelas faltantes
    for (const table of missingTables.slice()) { // slice() para não alterar a lista durante iteração
      if (tableCreationMap[table]) {
        const { repoClass, createMethod } = tableCreationMap[table];
        const repoInstance = new repoClass(dbSource);
        await repoInstance[createMethod]();
        checkedTables.push(table);
        missingTables.splice(missingTables.indexOf(table), 1);
      }
    }

    // Verificar `systables` com chkdb = true e retornar registros
    let systablesRecords: { id: number; nome: string; chkdb: number; numberregs?: number }[] = [];
    if (checkedTables.includes('systables')) {
      const systablesRepo = new SystablesRepository(dbSource);
      const records = await systablesRepo.findSystableAll({ chkdb: 1 });
      if (!records.length) {
        throw new Error('❌ `systables` não possui registros com chkdb = true. Sistema não pode iniciar.');
      }
      // Mapear para retorno simplificado
      systablesRecords = records.map(r => ({
        id: r.id,
        nome: r.nome,
        chkdb: r.chkdb,
        numberregs: r.numberregs,
      }));
    }

    await queryRunner.release();

    return {
      success: missingTables.length === 0,
      missingTables: missingTables.length > 0 ? missingTables : undefined,
      checkedTables,
      systablesRecords,
      message: missingTables.length > 0
        ? `❌ Tabelas faltando: ${missingTables.join(', ')}`
        : '✅ Todas as tabelas estão presentes e `systables` validada com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao verificar tabelas:', error);
    return { success: false, message: `❌ Erro ao verificar tabelas: ${(error as Error).message}` };
  }
}





// import { requiredTables } from '../config/tables';
// import { dbSource } from '../database';
// import { SystablesRepository } from '../use-cases/systable/systables.repository';
// import { PessoasRepository } from '../use-cases/pessoa/pessoas.repository';
// import { EmpresasRepository } from '../use-cases/empresa/empresas.repository';
// export async function checkTables(): Promise<{
//   success: boolean;
//   missingTables?: string[];
//   checkedTables?: string[];
//   message: string;
// }> {
//   try {
//     const queryRunner = dbSource.createQueryRunner();
//     await queryRunner.connect();

//     const tables = await queryRunner.query('SHOW TABLES');
//     const existingTables = tables.map((table: any) => Object.values(table)[0]);

//     const missingTables = requiredTables.filter(t => !existingTables.includes(t));
//     const checkedTables = requiredTables.filter(t => existingTables.includes(t));

//     // Criar tabela systables caso não exista
//     if (missingTables.includes('systables')) {
//       const systablesRepo = new SystablesRepository(dbSource);
//       await systablesRepo.createNotExistsSystables();
//       checkedTables.push('systables');
//       missingTables.splice(missingTables.indexOf('systables'), 1);
//     }

//     // Criar tabela pessoas caso não exista
//     if (missingTables.includes('pessoas')) {
//       const systablesRepo = new PessoasRepository(dbSource);
//       await systablesRepo.createNotExistsPessoas();
//       checkedTables.push('pessoas');
//       missingTables.splice(missingTables.indexOf('pessoas'), 1);
//     }

//     // Criar tabela empresas caso não exista
//     if (missingTables.includes('empresas')) {
//       const systablesRepo = new EmpresasRepository(dbSource);
//       await systablesRepo.createNotExistsEmpresas();
//       checkedTables.push('empresas');
//       missingTables.splice(missingTables.indexOf('empresas'), 1);
//     }
    

//     await queryRunner.release();

//     return {
//       success: missingTables.length === 0,
//       missingTables: missingTables.length > 0 ? missingTables : undefined,
//       checkedTables,
//       message: missingTables.length > 0
//         ? `❌ Tabelas faltando: ${missingTables.join(', ')}`
//         : '✅ Todas as tabelas estão presentes ou criadas com sucesso!'
//     };
//   } catch (error) {
//     console.error('Erro ao verificar tabelas:', error);
//     return { success: false, message: '❌ Erro ao verificar tabelas' };
//   }
// }



// // src/services/checkTables.ts
// import { requiredTables } from '../config/tables';
// import { dbSource } from '../database';

// export async function checkTables(): Promise<{
//   success: boolean;
//   missingTables?: string[];
//   checkedTables?: string[];
//   message: string;
// }> {
//   try {
//     const queryRunner = dbSource.createQueryRunner();
//     await queryRunner.connect();

//     const tables = await queryRunner.query('SHOW TABLES');
//     const existingTables = tables.map((table: any) => Object.values(table)[0]);

//     const missingTables = requiredTables.filter(t => !existingTables.includes(t));
//     const checkedTables = requiredTables.filter(t => existingTables.includes(t));

//     await queryRunner.release();

//     return {
//       success: missingTables.length === 0,
//       missingTables,
//       checkedTables,
//       message: missingTables.length > 0
//         ? `❌ Tabelas faltando: ${missingTables.join(', ')}`
//         : '✅ Todas as tabelas estão presentes!'
//     };
//   } catch (error) {
//     console.error('Erro ao verificar tabelas:', error);
//     return { success: false, message: '❌ Erro ao verificar tabelas' };
//   }
// }

