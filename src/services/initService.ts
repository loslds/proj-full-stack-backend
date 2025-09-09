
// C:\repository\proj-full-stack-backend\src\services\initService.ts
import { checkConnectionService } from "./checkConectionService";
import { checkTables } from "./checkTables";
import { syncSysTables } from "./syncsysTables";
import { requiredTables } from "../config/tables";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function initSystem() {
  const steps: { message: string; success: boolean }[] = [];

  // === Etapa 1: Conexão ===
  steps.push({ message: "⏳ Verificando conexão com o DATABASE...", success: true });
  await delay(800);
  const connResult = await checkConnectionService();
  if (!connResult.success) {
    steps.push({ message: "❌ Conexão falhou.", success: false });
    return { success: false, steps, message: "❌ Erro ao conectar com o banco" };
  }
  steps.push({ message: "✅ Serviço de Rede Conectado com Sucesso.", success: true });
  await delay(500);

  // === Etapa 2: Tabelas ===
  steps.push({ message: "⏳ Checando Banco de Dados...", success: true });
  await delay(800);
  const tablesResult = await checkTables();
  if (!tablesResult.success && tablesResult.missingTables?.length) {
    steps.push({ message: `❌ ${tablesResult.missingTables[0]} não foi possível constatar.`, success: false });
    return { success: false, steps, message: "❌ Falha na verificação das tabelas", missingTables: tablesResult.missingTables };
  }
  tablesResult.checkedTables?.forEach(tbl => steps.push({ message: `✅ ${tbl} Sucesso.`, success: true }));
  await delay(500);

  // === Etapa 3: Sincronismo ===
  steps.push({ message: "⏳ Aguarde sincronismo do Sistema...", success: true });
  await delay(800);
  try {
    await syncSysTables(requiredTables);
    steps.push({ message: "✅ Sincronismo concluído.", success: true });
  } catch {
    steps.push({ message: "⚠️ Falha no sincronismo, mas sistema pode continuar.", success: false });
  }

  steps.push({ message: "✅ Sistema pronto. Liberado para serviço.", success: true });

  return {
    success: true,
    steps,
    checkedTables: tablesResult.checkedTables,
    missingTables: tablesResult.missingTables,
    systablesRecords: tablesResult.systablesRecords,
    message: "✅ Sistema inicializado com sucesso"
  };
}
