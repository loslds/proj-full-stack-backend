
//C:\repository\proj-full-stack-backend\src\services\utility\imagens\mapImagensGridRow.ts

export function mapImagensGridRow(row) {
  return {
    id: row.id,
    nome: row.nome,
    tipo: row.tipo,
    svg: Boolean(row.svg),
  };
}