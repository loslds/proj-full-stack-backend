
// src/services/initSystem.ts
import { checkConnectionService } from './checkConectionService';
import { checkTables } from './checkTables';
import { systemTables } from '../system/tables';

import { systablesService } from './tables/systables.service';

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

/**
 * Serviços de tabelas controladas pelo sistema
 */
const tableServices = [
  systablesService,
];

export async function initSystem(): Promise<InitResult> {
  const steps: InitStep[] = [];
  let checkedTables: string[] = [];
  let missingTables: string[] = [];

  try {
    // ==================================================
    // 1️⃣ CONEXÃO
    // ==================================================
    steps.push({
      message: '🔌 Verificando conexão com o banco...',
      success: true,
    });

    const conn = await checkConnectionService();

    if (!conn.success) {
      steps.push({
        message: '❌ Falha na conexão com o banco.',
        success: false,
      });

      return {
        success: false,
        steps,
        checkedTables: [],
        missingTables: [],
        message: 'Sistema não pode ser iniciado.',
      };
    }

    steps.push({
      message: '✅ Conexão estabelecida.',
      success: true,
    });

    // ==================================================
    // 2️⃣ DIAGNÓSTICO DAS TABELAS
    // ==================================================
    steps.push({
      message: '🔍 Verificando estrutura das tabelas...',
      success: true,
    });

    const tablesResult = await checkTables();
    checkedTables = tablesResult.existingTables;
    missingTables = tablesResult.missingTables;

    // ==================================================
    // 3️⃣ CRIAÇÃO DAS TABELAS AUSENTES
    // ==================================================
    for (const service of tableServices) {
      if (missingTables.includes(service.tableName)) {
        steps.push({
          message: `🛠 Criando tabela <${service.tableName}>...`,
          success: true,
        });

        await service.create();

        // seed somente para systables
        if (service.tableName === 'systables') {
          steps.push({
            message: `📥 Inserindo dados iniciais em <${service.tableName}>...`,
            success: true,
          });

          await service.seed(systemTables);
        }
      }
    }

    // ==================================================
    // 4️⃣ RELATÓRIO DE ESTADO
    // ==================================================
    for (const table of checkedTables) {
      const count = tablesResult.records?.[table] ?? 0;

      steps.push({
        message:
          count === 0
            ? `⚠️ Tabela <${table}> existe, mas está vazia.`
            : `✅ Tabela <${table}> OK (${count} registros).`,
        success: true,
      });
    }

    // ==================================================
    // 5️⃣ UPDATES CONTROLADOS
    // ==================================================
    for (const service of tableServices) {
      steps.push({
        message: `🔄 Verificando atualizações em <${service.tableName}>...`,
        success: true,
      });

      await service.update();
    }

    // ==================================================
    // 6️⃣ SINCRONIZAÇÃO FINAL DA SYSTABLES
    // ==================================================
    steps.push({
      message: '🔄 Sincronizando estado do sistema...',
      success: true,
    });

    await systablesService.sync(systemTables);

    steps.push({
      message: '✅ Sistema pronto para operação.',
      success: true,
    });

    return {
      success: true,
      steps,
      checkedTables,
      missingTables,
      message: 'Sistema inicializado com sucesso.',
    };
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : 'Erro inesperado';

    steps.push({
      message: `❌ Erro durante inicialização: ${msg}`,
      success: false,
    });

    return {
      success: false,
      steps,
      checkedTables,
      missingTables,
      message: 'Erro ao inicializar o sistema.',
    };
  }
}
