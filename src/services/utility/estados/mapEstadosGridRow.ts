
//C:\repository\proj-full-stack-backend\src\services\utility\estados\mapEstadosGridRow.ts

export function mapEstadosGridRow(row) {
  return {
    id: row.id,
    nome: row.nome,
    prefixo: row.prefixo,
  };
}