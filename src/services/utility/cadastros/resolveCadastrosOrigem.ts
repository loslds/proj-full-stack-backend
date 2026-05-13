
//C:\repository\proj-full-stack-backend\src\services\utility\cadastros\resolveCadastrosOrigem.ts

export function resolveCadastrosOrigem(row) {
  if (row.id_empresas > 0) {
    return {
      id_origem: row.id_empresas,
      tab_nome: "empresas",
      origem_nome: row.empresas_nome ?? "",
    };
  }

  if (row.id_visitantes > 0) {
    return {
      id_origem: row.id_visitantes,
      tab_nome: "visitantes",
      origem_nome: row.visitantes_nome ?? "",
    };
  }

  if (row.id_consumidores > 0) {
    return {
      id_origem: row.id_consumidores,
      tab_nome: "consumidores",
      origem_nome: row.consumidores_nome ?? "",
    };
  }

  if (row.id_clientes > 0) {
    return {
      id_origem: row.id_clientes,
      tab_nome: "clientes",
      origem_nome: row.clientes_nome ?? "",
    };
  }

  if (row.id_fornecedores > 0) {
    return {
      id_origem: row.id_fornecedores,
      tab_nome: "fornecedores",
      origem_nome: row.fornecedores_nome ?? "",
    };
  }

  if (row.id_funcionarios > 0) {
    return {
      id_origem: row.id_funcionarios,
      tab_nome: "funcionarios",
      origem_nome: row.funcionarios_nome ?? "",
    };
  }

  return {
    id_origem: 0,
    tab_nome: "",
    origem_nome: "",
  };
}