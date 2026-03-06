 // src/services/initSystem.ts
import { checkConnectionService } from './checkConectionService';
import { checkTables } from './checkTables';

// fonte única do inventário do sistema
import { systemTables, tablesWithDefaults } from './tables/tables';

// registry das tabelas "normais" (pessoas, estados, cidades...)
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
  console.log('>>> [initSystem] função foi chamada');

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

    console.log('>>> [initSystem] verificando conexão com o banco...');

    const conn = await checkConnectionService();

    console.log('>>> [initSystem] resultado da conexão:', conn);

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

    console.log('>>> [initSystem] executando checkTables()...');

    const tablesResult = await checkTables();
    checkedTables = tablesResult.existingTables;
    missingTables = tablesResult.missingTables;

    console.log('>>> [initSystem] existingTables:', checkedTables);
    console.log('>>> [initSystem] missingTables:', missingTables);
    console.log('>>> [initSystem] services registrados:', [...tableServiceMap.keys()]);
    console.log('>>> [initSystem] tablesWithDefaults:', [...tablesWithDefaults]);

    // ==================================================
    // 3️⃣ CRIAÇÃO DAS TABELAS AUSENTES
    // ==================================================

    // 3.1) systables primeiro
    if (missingTables.includes('systables')) {
      console.log('>>> [initSystem] systables está ausente, criando...');

      steps.push({
        message: '🛠 Criando tabela <systables>...',
        success: true,
      });

      await systablesService.create();

      console.log('>>> [initSystem] systables criada/verificada');

      steps.push({
        message: '📥 Inserindo registros iniciais em <systables>...',
        success: true,
      });

      await systablesService.seed(systemTables);

      console.log('>>> [initSystem] seed inicial de systables concluído');
    }

    // 3.2) demais tabelas via registry
    for (const tableName of missingTables) {
      if (tableName === 'systables') continue;

      console.log(`>>> [initSystem] processando tabela ausente: ${tableName}`);

      const service = tableServiceMap.get(tableName);

      console.log(
        `>>> [initSystem] service encontrado para ${tableName}?`,
        !!service
      );

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

      console.log(`>>> [initSystem] chamando create() para ${tableName}...`);
      await service.create();
      console.log(`>>> [initSystem] create() concluído para ${tableName}`);

      if (
        (tablesWithDefaults as readonly string[]).includes(tableName) &&
        service.seed
      ) {
        steps.push({
          message: `📥 Inserindo registros padrão em <${tableName}>...`,
          success: true,
        });

        console.log(`>>> [initSystem] chamando seed() para ${tableName}...`);
        await service.seed();
        console.log(`>>> [initSystem] seed() concluído para ${tableName}`);
      } else {
        console.log(
          `>>> [initSystem] ${tableName} não possui seed configurado no fluxo atual`
        );
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
    steps.push({
      message: '🔄 Verificando atualizações em <systables>...',
      success: true,
    });

    console.log('>>> [initSystem] verificando updates de systables...');
    await systablesService.update();

    for (const [, service] of tableServiceMap) {
      steps.push({
        message: `🔄 Verificando atualizações em <${service.tableName}>...`,
        success: true,
      });

      console.log(`>>> [initSystem] verificando updates de ${service.tableName}...`);

      if (service.update) {
        await service.update();
      }
    }

    // ==================================================
    // 6️⃣ SINCRONIZAÇÃO FINAL DA SYSTABLES
    // ==================================================
    steps.push({
      message: '🔄 Sincronizando estado do sistema...',
      success: true,
    });

    console.log('>>> [initSystem] sincronizando systables...');
    await systablesService.sync(systemTables);
    console.log('>>> [initSystem] sincronização concluída');

    // ==================================================
    // 7️⃣ MARCA SISTEMA COMO INSTALADO (RUNTIME)
    // ==================================================
    systemStateService.markInitialized();

    steps.push({
      message: '✅ Sistema instalado e pronto para operação.',
      success: true,
    });

    console.log('>>> [initSystem] instalação concluída com sucesso');

    return {
      success: true,
      steps,
      checkedTables,
      missingTables,
      message: 'Instalação concluída com sucesso.',
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro inesperado';

    console.error('>>> [initSystem] erro capturado:', error);

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