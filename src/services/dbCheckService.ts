
// src/services/dbCheckService.ts
import { AppDataSource } from "../config/db";
import { systemTables } from "../system/tables";
interface CheckOptions {
  updateSysMaster?: boolean; // se true, atualiza a linha sys_master
}


interface CheckOptions {
  updateSysMaster?: boolean;
}

interface CheckResult {
  success: boolean;
  messages: string[];
}

export async function checkAndInitializeSystem(
  tables: string[] = systemTables,
  options: CheckOptions = { updateSysMaster: true }
): Promise<CheckResult> {
  const messages: string[] = [];
  let overallOk = true;

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    messages.push("✅ DataSource inicializado.");
  }

  const queryRunner = AppDataSource.createQueryRunner();

  try {
    await queryRunner.connect();

    // ==================================================
    // 1️⃣ systables
    // ==================================================
    messages.push("🔍 Verificando tabela <systables>...");
    const systableExists = await queryRunner.query(
      "SHOW TABLES LIKE 'systables'"
    );

    if (systableExists.length === 0) {
      messages.push("❌ Tabela <systables> inexistente. Criando...");
      await queryRunner.query(`
        CREATE TABLE systables (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          nome VARCHAR(60) NOT NULL,
          numberregs INT UNSIGNED NOT NULL DEFAULT 0,
          chkdb TINYINT(1) NOT NULL DEFAULT 0,
          createdBy INT UNSIGNED DEFAULT NULL,
          createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedBy INT UNSIGNED DEFAULT NULL,
          updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          UNIQUE KEY uniq_systables_nome (nome)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
      messages.push("✅ Tabela <systables> criada.");
    } else {
      messages.push("✅ Tabela <systables> já existe.");
    }

    

    // ==================================================
    // 2️⃣ Demais tabelas mínimas
    // ==================================================
    for (const tbl of tables) {
      messages.push(`🔍 Verificando tabela <${tbl}>...`);

      const exists = await queryRunner.query(
        `SHOW TABLES LIKE '${tbl}'`
      );

      if (exists.length === 0) {
        messages.push(`❌ Tabela <${tbl}> inexistente. Criando estrutura mínima...`);
        await queryRunner.query(`
          CREATE TABLE \`${tbl}\` (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(60) DEFAULT NULL,
            createdBy INT UNSIGNED DEFAULT NULL,
            createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedBy INT UNSIGNED DEFAULT NULL,
            updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        messages.push(`✅ Tabela <${tbl}> criada.`);
      } else {
        messages.push(`✅ Tabela <${tbl}> existe.`);
      }

      // ==================================================
      // 3️⃣ Contagem de registros
      // ==================================================
      let count = 0;
      try {
        const rows = await queryRunner.query(
          `SELECT COUNT(*) AS cnt FROM \`${tbl}\``
        );
        count = rows[0]?.cnt ?? 0;
        messages.push(`📊 <${tbl}> possui ${count} registro(s).`);
      } catch (err) {
        messages.push(`❌ Erro ao contar registros de <${tbl}>.`);
        console.error(err);
        overallOk = false;
      }

      // ==================================================
      // 4️⃣ Atualiza systables
      // ==================================================
      try {
        await queryRunner.query(
          `
          INSERT INTO systables (nome, chkdb, numberregs, createdAt, updatedAt)
          VALUES (?, ?, ?, NOW(), NOW())
          ON DUPLICATE KEY UPDATE
            chkdb = VALUES(chkdb),
            numberregs = VALUES(numberregs),
            updatedAt = NOW();
        `,
          [tbl, count > 0 ? 1 : 0, count]
        );

        if (count === 0) {
          messages.push(`⚠️ Tabela <${tbl}> está vazia.`);
          overallOk = false;
        } else {
          messages.push(`✅ Tabela <${tbl}> com dados OK.`);
        }
      } catch (err) {
        messages.push(`❌ Falha ao atualizar <systables> para <${tbl}>.`);
        console.error(err);
        overallOk = false;
      }
    }

    // ==================================================
    // 5️⃣ sys_master (opcional / legado)
    // ==================================================
    if (options.updateSysMaster) {
      try {
        await queryRunner.query(
          `
          INSERT INTO systables (nome, chkdb, numberregs, createdAt, updatedAt)
          VALUES (?, ?, ?, NOW(), NOW())
          ON DUPLICATE KEY UPDATE
            chkdb = VALUES(chkdb),
            numberregs = VALUES(numberregs),
            updatedAt = NOW();
        `,
          ["sys_master", overallOk ? 1 : 0, 0]
        );

        messages.push(
          overallOk
            ? "✅ Sistema pronto. Liberado para serviço."
            : "❌ Requisitos não aceitáveis. Sistema inoperante."
        );
      } catch (err) {
        messages.push("❌ Erro ao atualizar registro <sys_master>.");
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
    } catch {}
  }
}
