
//C:\repository\proj-full-stack-backend\src\services\utility\pessoas\mapPessoasGrid.ts

export function mapPessoasGridRow(row) {
  return {
    id: row.id,
    nome: row.nome,
    sigla: row.sigla,
  };
}