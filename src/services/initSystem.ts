// src/services/initSystem.ts
import { checkConnectionService } from './checkConectionService';
import { checkTables } from './checkTables';

// ✅ fonte única do inventário do sistema
import { systemTables, tablesWithDefaults } from './tables/tables';

// ✅ registry das tabelas "normais" (pessoas, estados, cidades...)
import { tableServiceMap } from './tables';

import { systablesService } from './tables/systables.service';
import { systemStateService } from './systemStateService';

// ==================================================
// Tipos
// ==================================================
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

// ==================================================
// Inicialização do sistema (INSTALAÇÃO)
// ==================================================
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
        message: 'Sistema não pode ser iniciado (sem conexão).',
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

    // 3.1) systables primeiro (exceção: seed recebe lista de tabelas)
    if (missingTables.includes('systables')) {
      steps.push({
        message: '🛠 Criando tabela <systables>...',
        success: true,
      });

      await systablesService.create();

      steps.push({
        message: '📥 Inserindo registros iniciais em <systables>...',
        success: true,
      });

      await systablesService.seed(systemTables);
    }

    // 3.2) demais tabelas via registry
    for (const tableName of missingTables) {
      if (tableName === 'systables') continue;

      const service = tableServiceMap.get(tableName);

      if (!service) {
        steps.push({
          message: `⚠️ Não existe service registrado para <${tableName}>. Tabela não será criada automaticamente.`,
          success: true,
        });
        continue;
      }

      steps.push({
        message: `🛠 Criando tabela <${tableName}>...`,
        success: true,
      });

      await service.create();

      // Seed somente para tabelas com defaults e que implementam seed()
      if (
        (tablesWithDefaults as readonly string[]).includes(tableName) &&
        service.seed
      ) {
        steps.push({
          message: `📥 Inserindo registros padrão em <${tableName}>...`,
          success: true,
        });

        await service.seed();
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
    // systables (exceção)
    steps.push({
      message: '🔄 Verificando atualizações em <systables>...',
      success: true,
    });
    await systablesService.update();

    // demais tabelas (registry)
    for (const [, service] of tableServiceMap) {
      steps.push({
        message: `🔄 Verificando atualizações em <${service.tableName}>...`,
        success: true,
      });

      if (service.update) await service.update();
    }

    // ==================================================
    // 6️⃣ SINCRONIZAÇÃO FINAL DA SYSTABLES
    // ==================================================
    steps.push({
      message: '🔄 Sincronizando estado do sistema...',
      success: true,
    });

    await systablesService.sync(systemTables);

    // ==================================================
    // 7️⃣ MARCA SISTEMA COMO INSTALADO (RUNTIME)
    // ==================================================
    systemStateService.markInitialized();

    steps.push({
      message: '✅ Sistema instalado e pronto para operação.',
      success: true,
    });

    return {
      success: true,
      steps,
      checkedTables,
      missingTables,
      message: 'Instalação concluída com sucesso.',
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro inesperado';

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