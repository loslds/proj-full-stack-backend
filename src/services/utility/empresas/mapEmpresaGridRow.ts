
//C:\repository\proj-full-stack-backend\src\services\utility\empresas\mapEmpresaGridRow.ts

export function mapEmpresaGridRow(row) {
  return {
    id: row.id,
    id_pessoas: row.id_pessoas,

    tipo_pessoa: row.pessoa_sigla ?? "",
    tipo_pessoa_nome: row.pessoa_nome ?? "",

    nome: row.nome,
    fantasy: row.fantasy,
  };
}

