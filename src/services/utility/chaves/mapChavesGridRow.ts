
// C:\repository\proj-full-stack-backend\src\services\utility\chaves\mapChavesGridRow.ts

export function mapChavesGridRow(row: any) {
  return {
    id: row.id,

    id_users: row.id_users,

    nome: row.nome,

    identificador: row.identificador,

    psw_hash: row.psw_hash,

    min_hash: row.min_hash,

    ativo: Number(row.ativo),

    is_actived: Number(row.is_actived)
  };
}

