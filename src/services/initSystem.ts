
// C:\repository\proj-full-stack-backend\src\services\initSystem.ts
// src/services/initSystem.ts
import { checkConnectionService } from "./checkConectionService";
import { checkTables } from "./checkTables";
import { syncsysTables } from "./syncsysTables";
import { SYSTEM_TABLES_TOTAL } from "../system/tables";

export interface InitStep {
  message: string;
  success: boolean;
}

export interface InitResult {
  success: boolean;
  steps: InitStep[];
  checkedTables: string[];
  missingTables: string[];
  message: string;
}

export async function initSystem(): Promise<InitResult> {
  const steps: InitStep[] = [];
  let checkedTables: string[] = [];
  let missingTables: string[] = [];

  try {
    // ==================================================
    // 1️⃣ CONEXÃO COM DATABASE
    // ==================================================
    steps.push({
      message: "🔌 Verificando conexão com o banco de dados...",
      success: true,
    });

    const conn = await checkConnectionService();

    if (!conn.success) {
      steps.push({
        message: "❌ Falha na conexão com o banco de dados.",
        success: false,
      });

      return {
        success: false,
        steps,
        checkedTables: [],
        missingTables: [],
        message: "Sistema não pode ser iniciado (sem conexão).",
      };
    }

    steps.push({
      message: "✅ Conexão com banco de dados estabelecida.",
      success: true,
    });

    // ==================================================
    // 2️⃣ CHECAGEM / CRIAÇÃO DE ESTRUTURAS
    // ==================================================
    steps.push({
      message: "🔍 Verificando estruturas do sistema...",
      success: true,
    });

    const tablesResult = await checkTables();

    checkedTables = tablesResult.existingTables;
    missingTables = tablesResult.missingTables;

    // Caso crítico: apenas systables
    if (
      checkedTables.length === 1 &&
      checkedTables[0] === "systables"
    ) {
      steps.push({
        message:
          "⛔ Apenas a tabela <systables> existe. Base operacional inexistente.",
        success: false,
      });

      return {
        success: false,
        steps,
        checkedTables,
        missingTables,
        message: "Sistema inoperante (base incompleta).",
      };
    }

    // Informativo: total esperado
    if (checkedTables.length - 1 !== SYSTEM_TABLES_TOTAL) {
      steps.push({
        message: `ℹ️ Tabelas esperadas: ${SYSTEM_TABLES_TOTAL}. Encontradas: ${
          checkedTables.length - 1
        }.`,
        success: true,
      });
    }

    // Relatório por tabela
    for (const table of checkedTables) {
      if (table === "systables") continue;

      const count = tablesResult.records?.[table] ?? 0;

      steps.push({
        message:
          count === 0
            ? `⚠️ Tabela <${table}> existe, porém está vazia.`
            : `✅ Tabela <${table}> OK (${count} registros).`,
        success: true,
      });
    }

    // ==================================================
    // 3️⃣ SINCRONIZAÇÃO FINAL (systables)
    // ==================================================
    steps.push({
      message: "🔄 Sincronizando estado do sistema...",
      success: true,
    });

    try {
      await syncsysTables();
      steps.push({
        message: "✅ Sincronização da <systables> concluída.",
        success: true,
      });
    } catch (err) {
      steps.push({
        message:
          "⚠️ Falha ao sincronizar <systables>. Estado parcial mantido.",
        success: true,
      });
    }

    // ==================================================
    // FINAL
    // ==================================================
    steps.push({
      message: "✅ Sistema liberado para operação.",
      success: true,
    });

    return {
      success: true,
      steps,
      checkedTables,
      missingTables,
      message: "Sistema inicializado com sucesso.",
    };
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Erro inesperado";

    steps.push({
      message: `❌ Erro inesperado durante inicialização: ${msg}`,
      success: false,
    });

    return {
      success: false,
      steps,
      checkedTables,
      missingTables,
      message: "Erro inesperado ao inicializar o sistema.",
    };
  }
}
