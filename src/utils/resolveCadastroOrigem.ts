
//C:\repository\proj-full-stack-backend\src\utils\resolveCadastroOrigem.ts

type CadastroRow = {
  id_empresas?: number;
  id_visitantes?: number;
  id_consumidores?: number;
  id_clientes?: number;
  id_fornecedores?: number;
  id_funcionarios?: number;

  empresas_nome?: string | null;
  visitantes_nome?: string | null;
  consumidores_nome?: string | null;
  clientes_nome?: string | null;
  fornecedores_nome?: string | null;
  funcionarios_nome?: string | null;
};

export function resolveCadastroOrigem(row: CadastroRow): string {
  if ((row.id_empresas ?? 0) > 0) {
    return row.empresas_nome ?? "";
  }

  if ((row.id_visitantes ?? 0) > 0) {
    return row.visitantes_nome ?? "";
  }

  if ((row.id_consumidores ?? 0) > 0) {
    return row.consumidores_nome ?? "";
  }

  if ((row.id_clientes ?? 0) > 0) {
    return row.clientes_nome ?? "";
  }

  if ((row.id_fornecedores ?? 0) > 0) {
    return row.fornecedores_nome ?? "";
  }

  if ((row.id_funcionarios ?? 0) > 0) {
    return row.funcionarios_nome ?? "";
  }

  return "";
}