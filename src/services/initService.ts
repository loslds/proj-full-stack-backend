
// C:\repository\proj-full-stack-backend\src\services\initService.ts

import { checkConnectionService } from "./checkConectionService";
import { checkTables } from "./checkTables";
import { syncsysTables } from "./syncsysTables";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export interface InitStep {
  message: string;
  success: boolean;
}

export interface InitResult {
  success: boolean;
  steps: InitStep[];
  checkedTables?: string[];
  missingTables?: string[];
  systablesRecords?: any[];
  message: string;
}

export async function initSystem(): Promise<InitResult> {
  const steps: InitStep[] = [];

  try {
    // === Etapa 1: Conexão ===
    steps.push({ message: "⏳ Verificando conexão com o DATABASE...", success: true });
    await delay(800);

    const connResult = await checkConnectionService();
    if (!connResult.success) {
      steps.push({ message: "❌ Falha com a Conexão de Banco de Dados.", success: false });
      return { success: false, steps, message: "❌ Erro na inicialização: Conexão falhou" };
    }

    steps.push({ message: "✅ Conexão com Banco de Dados realizada com sucesso.", success: true });
    await delay(500);

    // === Etapa 2: Tabelas ===
    steps.push({ message: "⏳ Checando Existência de Dados...", success: true });
    await delay(800);

    const tablesResult = await checkTables();
    if (!tablesResult.success && tablesResult.missingTables?.length) {
      steps.push({ message: `❌ ${tablesResult.missingTables[0]} não foi possível checar!`, success: false });
      return {
        success: false,
        steps,
        message: "❌ Falha na verificação: [Inexistênte, Corrompido ou erro na busca.].",
        missingTables: tablesResult.missingTables
      };
    }

    tablesResult.checkedTables?.forEach(tbl => steps.push({ message: `✅ ${tbl} Sucesso ao Lista de Dados.`, success: true }));
    await delay(500);

    // === Etapa 3: Sincronismo ===
    steps.push({ message: "⏳ Aguarde sincronismo do Sistema...", success: true });
    await delay(800);

    try {
      await syncsysTables();
      steps.push({ message: "✅ Sincronismo concluído.", success: true });
    } catch {
      steps.push({ message: "⚠️ Falha no sincronismo, mas sistema pode continuar.", success: false });
    }

    // Finalização
    steps.push({ message: "✅ Sistema pronto. Liberado para serviço.", success: true });

    return {
      success: true,
      steps,
      checkedTables: tablesResult.checkedTables,
      missingTables: tablesResult.missingTables,
      systablesRecords: tablesResult.systablesRecords,
      message: "✅ Sistema inicializado com sucesso"
    };
  } catch (error: any) {
    steps.push({ message: `❌ [Início] Erro inesperado: ${error.message}`, success: false });
    return { success: false, steps, message: "❌ Erro ao inicializar sistema" };
  }
}

