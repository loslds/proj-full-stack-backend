
// C:\repository\proj-full-stack-backend\src\services\tables\tableService.types.ts
/**
 * Contrato padrão para serviços de tabelas do sistema.
 *
 * Cada tabela que o sistema gerencia deve possuir
 * um service que implemente esta interface.
 *
 * Responsabilidades do service:
 * - Criar a estrutura física da tabela
 * - Inserir dados padrão (quando necessário)
 * - Executar atualizações/migrações controladas
 */

export interface TableService {
  /**
   * Nome da tabela no banco de dados
   */
  tableName: string;

  /**
   * Cria a estrutura física da tabela
   * (CREATE TABLE IF NOT EXISTS)
   */
  create(): Promise<void>;

  /**
   * Insere registros padrão (seed)
   * Opcional — somente para tabelas
   * que possuem dados iniciais.
   */
  seed?(): Promise<void>;

  /**
   * Executa atualizações estruturais
   * ou migrações controladas.
   * Opcional.
   */
  update?(): Promise<void>;
}