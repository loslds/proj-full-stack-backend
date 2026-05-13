
//C:\repository\proj-full-stack-backend\src\services\utility\acoes\mapAcoesGridRow.ts

export function mapAcoesGridRow(row) {
  return {
    id: row.id,
    nome: row.nome,
    abrev: row.abrev,
    cor: row.cor,
    nivel: row.nivel,
  };
}