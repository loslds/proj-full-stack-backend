
//C:\repository\proj-full-stack-backend\src\services\utility\clientes\mapClientesGridRow.ts

export function mapClientesGridRow(row) {
  return {
    id: row.id,

    id_pessoas: row.id_pessoas,
    tipo_pessoa: row.pessoa_sigla ?? "",

    id_empresas: row.id_empresas,
    empresa_nome: row.empresa_nome ?? "",

    nome: row.nome,
    fantasy: row.fantasy,
  };
}
