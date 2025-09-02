
// src/dbCheckService.ts

// src/services/dbCheckService.ts
import { dbSource } from "../database";
import { requiredTables } from "../config/tables";

interface CheckOptions {
  updateSysMaster?: boolean; // se true, atualiza a linha sys_master
}

export async function checkAndInitializeSystem(
  tables: string[] = requiredTables,
  options: CheckOptions = { updateSysMaster: true }
): Promise<{ success: boolean; messages: string[] }> {
  const messages: string[] = [];
  let overallOk = true;

  const queryRunner = dbSource.createQueryRunner();

  try {
    // Conecta ao banco
    if (!dbSource.isInitialized) await dbSource.initialize();
    await queryRunner.connect();

    // 1️⃣ Verifica se a tabela 'systable' existe
    messages.push("🔍 Verificando existência da tabela systable...");
    const systableRows = await queryRunner.query("SHOW TABLES LIKE 'systable'");
    if (systableRows.length === 0) {
      messages.push("❌ Tabela systable não existe. Criando...");
      await queryRunner.query(`
        CREATE TABLE systable (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          nome VARCHAR(60) NOT NULL,
          numberRRegs INT UNSIGNED NOT NULL DEFAULT 0,
          chkdb TINYINT(1) NOT NULL DEFAULT 0,
          createBy INT UNSIGNED DEFAULT NULL,
          createAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updateBy INT UNSIGNED DEFAULT NULL,
          updateAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          UNIQUE KEY uniq_systable_nome (nome)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
      messages.push("✅ systable criada.");
    } else {
      messages.push("✅ systable existe.");
    }

    // 2️⃣ Verifica cada tabela mínima
    for (const tbl of tables) {
      messages.push(`🔍 Verificando tabela "${tbl}"...`);
      const tblRows = await queryRunner.query(`SHOW TABLES LIKE '${tbl}'`);

      if (tblRows.length === 0) {
        messages.push(`❌ Tabela "${tbl}" não encontrada. Criando esqueleto mínimo...`);
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS \`${tbl}\` (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(60) DEFAULT NULL,
            createBy INT UNSIGNED DEFAULT NULL,
            createAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updateBy INT UNSIGNED DEFAULT NULL,
            updateAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY uniq_${tbl}_id (id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        messages.push(`✅ Tabela "${tbl}" criada.`);
      } else {
        messages.push(`✅ Tabela "${tbl}" existe.`);
      }

      // 3️⃣ Conta registros
      let cnt = 0;
      try {
        const countRows = await queryRunner.query(`SELECT COUNT(*) as cnt FROM \`${tbl}\``);
        cnt = countRows[0]?.cnt ?? 0;
        messages.push(`📊 Tabela "${tbl}" possui ${cnt} registro(s).`);
      } catch (err) {
        messages.push(`❌ Erro ao contar registros da tabela "${tbl}".`);
        console.error(`Erro tabela ${tbl}:`, err);
        overallOk = false;
      }

      // 4️⃣ Atualiza ou insere na systable
      try {
        await queryRunner.query(
          `INSERT INTO systable (nome, chkdb, numberRRegs, createAt, updateAt)
           VALUES (?, ?, ?, NOW(), NOW())
           ON DUPLICATE KEY UPDATE chkdb = VALUES(chkdb), numberRRegs = VALUES(numberRRegs), updateAt = NOW();`,
          [tbl, cnt > 0 ? 1 : 0, cnt]
        );

        if (cnt === 0) {
          messages.push(`⚠️ Tabela "${tbl}" está vazia. Verificar dados.`);
          overallOk = false;
        } else {
          messages.push(`✅ Tabela "${tbl}" com dados OK.`);
        }
      } catch (err) {
        messages.push(`❌ Erro ao atualizar systable para "${tbl}".`);
        console.error(err);
        overallOk = false;
      }
    }

    // 5️⃣ Atualiza/insere linha 'sys_master' se habilitado
    if (options.updateSysMaster) {
      try {
        await queryRunner.query(
          `INSERT INTO systable (nome, chkdb, numberRRegs, createAt, updateAt)
           VALUES (?, ?, ?, NOW(), NOW())
           ON DUPLICATE KEY UPDATE chkdb = VALUES(chkdb), numberRRegs = VALUES(numberRRegs), updateAt = NOW();`,
          ["sys_master", overallOk ? 1 : 0, 0]
        );

        messages.push(
          overallOk
            ? "✅ Sistema pronto. Liberado para serviço."
            : "❌ Requisitos não aceitáveis. Solicitar contato com Administrador."
        );
      } catch (err) {
        messages.push("❌ Erro ao atualizar sys_master.");
        console.error(err);
      }
    }

    return { success: overallOk, messages };
  } catch (error) {
    console.error("❌ Erro em checkAndInitializeSystem:", error);
    messages.push("❌ Erro inesperado durante a verificação do sistema.");
    return { success: false, messages };
  } finally {
    try {
      await queryRunner.release();
    } catch (e) {
      // ignora erros de release
    }
  }
}
