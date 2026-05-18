
//C:\repository\proj-full-stack-backend\src\services\utility\imagens\mapImagensGridRow.ts
export function mapImagensGridRow(row: any) {
  return {
    id: row.id,
    preview: row.svg,
    nome: row.nome,
    tipo: row.tipo,
    path_origem: row.path_origem,
    path_dest: row.path_dest
  };
}