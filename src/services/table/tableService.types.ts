

// C:\repository\proj-full-stack-backend\src\services\table\tableService.types.ts

/**
 * Contrato padrão para services de tabelas do sistema.
 *
 * Cada tabela gerenciada pode implementar:
 * - criação da estrutura física
 * - contagem de registros
 * - seed inicial
 * - update/sincronização controlada
 *
 * Observação:
 * Alguns services, como systables, podem receber
 * parâmetros em seed/update. Por isso a assinatura
 * é flexível.
 */
export interface TableService {
  /**
   * Nome da tabela no banco
   */
  tableName: string;

  /**
   * Garante conexão, quando o service precisar
   */
  ensureConnection?(): Promise<void>;

  /**
   * Cria a estrutura física da tabela
   */
  create(): Promise<void>;

  /**
   * Retorna quantidade de registros
   */
  count(): Promise<number>;

  /**
   * Seed inicial
   * Pode ou não receber parâmetros
   */
  seed?(...args: any[]): Promise<any>;

  /**
   * Update / sincronização / migração controlada
   * Pode ou não receber parâmetros
   */
  update?(...args: any[]): Promise<any>;
}

