
//C:\repository\proj-full-stack-backend\src\services\utility\grpservicos\mapGrpservicosGridRow.ts

export function mapGrpservicosGridRow(row) {
  return {
    id: row.id,
    id_servicos: row.id_servicos,
    nome: row.nome,
  };
}

