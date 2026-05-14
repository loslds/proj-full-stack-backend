
// C:\repository\proj-full-stack-backend\src\services\utility\users\mapUsersGridRow.ts

export function mapUsersGridRow(row: any) {
  return {
    id: row.id,

    id_cadastros: row.id_cadastros,

    cadastros_id: row.cadastros_id,

    nome: row.nome,

    is_actived: Number(row.is_actived)
  };
}

