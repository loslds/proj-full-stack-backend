

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








// // C:\repository\proj-full-stack-backend\src\services\table\tableService.types.ts
// /**
//  * Contrato padrão para serviços de tabelas do sistema.
//  *
//  * Cada tabela que o sistema gerencia deve possuir
//  * um service que implemente esta interface.
//  *
//  * Responsabilidades do service:
//  * - Criar a estrutura física da tabela
//  * - Inserir dados padrão (quando necessário)
//  * - Executar atualizações/migrações controladas
//  */

// export interface TableService {
//   /**
//    * Nome da tabela no banco de dados
//    */
//   tableName: string;

//   /**
//    * Cria a estrutura física da tabela
//    * (CREATE TABLE IF NOT EXISTS)
//    */
//   create(): Promise<void>;

//   /**
//    * Insere registros padrão (seed)
//    * Opcional — somente para tabelas
//    * que possuem dados iniciais.
//    */
//   seed?(): Promise<void>;

//   /**
//    * Executa atualizações estruturais
//    * ou migrações controladas.
//    * Opcional.
//    */
//   update?(): Promise<void>;
// }

