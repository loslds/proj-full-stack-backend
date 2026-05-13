
//C:\repository\proj-full-stack-backend\src\services\utility\cidades\mapCidadesGridRow.ts

export function mapCidadesGridRow(row) {
  return {
    id: row.id,
    nome: row.nome,
    id_estados: row.id_estados,

    estados: {
      id: row.estado_id,
      nome: row.estado_nome,
      prefixo: row.estado_prefixo,
    },
  };
}