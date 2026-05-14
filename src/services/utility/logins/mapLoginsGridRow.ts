
// C:\repository\proj-full-stack-backend\src\services\utility\logins\mapLoginsGridRow.ts

export function mapLoginsGridRow(row: any) {
  return {
    id: row.id,

    id_users: row.id_users,

    nome: row.nome,

    is_actived: Number(row.is_actived),

    dt_login: row.dt_login,

    dt_logout: row.dt_logout,

    tt_minutos: Number(row.tt_minutos)
  };
}

