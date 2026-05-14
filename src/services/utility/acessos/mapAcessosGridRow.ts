
// C:\repository\proj-full-stack-backend\src\services\utility\acessos\mapAcessosGridRow.ts

export function mapAcessosGridRow(row: any) {
  return {
    id: row.id,

    id_users: row.id_users,

    nome: row.nome,

    is_actived: Number(row.is_actived),

    permissoes:
      typeof row.permissoes === 'string'
        ? JSON.parse(row.permissoes)
        : row.permissoes
  };
}

