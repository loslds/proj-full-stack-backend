
// src/use-cases/start/dbCheckService.ts
import { dbSource } from './dbSource';

export async function checkAndInitializeSystem(requiredTables: string[] = ['systable', 'pessoas', 'empresas']) {
  const messages: string[] = [];
  let overallOk = true;
  const queryRunner = dbSource.createQueryRunner();

  try {
    await queryRunner.connect();

    // 1) Garantir que sys_data exista (com UNIQUE(nome) para permitir upsert)
    messages.push('🔍 Verificando existência da tabela sys_data...');
    const [sysRows] = await queryRunner.query("SHOW TABLES LIKE 'sys_data'");
    if ((sysRows as any[]).length === 0) {
      messages.push('❌ Tabela sys_data não existe. Criando sys_data...');
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS sys_data (
          id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          nome VARCHAR(60) NOT NULL,
          chkdb TINYINT(1) NOT NULL DEFAULT 0,
          createBy INT DEFAULT NULL,
          createAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updateBy INT DEFAULT NULL,
          updateAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          UNIQUE KEY uniq_sys_data_nome (nome)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
      messages.push('✅ sys_data criada.');
    } else {
      messages.push('✅ sys_data existe.');
    }

    // 2) Para cada tabela requerida: verificar, criar se necessário, contar registros e atualizar sys_data
    for (const tbl of requiredTables) {
      messages.push(`🔍 Verificando tabela "${tbl}"...`);
      const [tblRows] = await queryRunner.query(`SHOW TABLES LIKE '${tbl}'`);

      if ((tblRows as any[]).length === 0) {
        messages.push(`❌ Tabela "${tbl}" não encontrada. Criando tabela "${tbl}" (esqueleto)...`);
        // cria um esquema mínimo para a tabela (ajuste conforme sua entidade real)
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS \`${tbl}\` (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(100) DEFAULT NULL
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        messages.push(`✅ Tabela "${tbl}" criada.`);
      } else {
        messages.push(`✅ Tabela "${tbl}" existe.`);
      }

      // Contar registros
      try {
        const [countRows] = await queryRunner.query(`SELECT COUNT(*) as cnt FROM \`${tbl}\``);
        const cnt = (countRows as any)[0]?.cnt ?? 0;
        messages.push(`📊 Tabela "${tbl}" possui ${cnt} registro(s).`);

        // Upsert na sys_data para esta tabela
        await queryRunner.query(
          `INSERT INTO sys_data (nome, chkdb, createAt, updateAt)
           VALUES (?, ?, NOW(), NOW())
           ON DUPLICATE KEY UPDATE chkdb = VALUES(chkdb), updateAt = NOW();`,
          [tbl, cnt > 0 ? 1 : 0]
        );

        if (cnt === 0) {
          messages.push(`⚠️ Tabela "${tbl}" está vazia. Solicitar presença do Administrador.`);
          overallOk = false;
        } else {
          messages.push(`✅ Tabela "${tbl}" com dados OK.`);
        }
      } catch (err) {
        messages.push(`❌ Erro ao contar/registar tabela "${tbl}".`);
        console.error(`Erro tabela ${tbl}:`, err);
        overallOk = false;
      }
    }

    // 3) Atualiza/insere a linha 'sys_master' que representa o estado geral do sistema
    await queryRunner.query(
      `INSERT INTO sys_data (nome, chkdb, createAt, updateAt)
       VALUES (?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE chkdb = VALUES(chkdb), updateAt = NOW();`,
      ['sys_master', overallOk ? 1 : 0]
    );

    messages.push(overallOk ? '✅ Sistema pronto. Liberado para serviço.' : '❌ Requisitos não aceitáveis. Solicitar contato com Administrador.');

    return { success: overallOk, messages };
  } catch (error) {
    console.error('Erro em checkAndInitializeSystem:', error);
    messages.push('❌ Erro inesperado durante a verificação do sistema.');
    return { success: false, messages };
  } finally {
    try {
      await queryRunner.release();
    } catch (e) {
      // ignore
    }
  }
}