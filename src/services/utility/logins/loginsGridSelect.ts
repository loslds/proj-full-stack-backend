
// C:\repository\proj-full-stack-backend\src\services\utility\logins\loginsGridSelect.ts

export const loginsGridSelect = `
SELECT
  logins.id,

  logins.id_users,

  logins.dt_login,
  logins.dt_logout,

  logins.tt_minutos,

  users.is_actived,

  COALESCE(
    funcionarios.nome,
    fornecedores.nome,
    clientes.nome,
    consumidores.nome,
    visitantes.nome,
    empresas.nome
  ) AS nome

FROM logins

LEFT JOIN users
  ON users.id = logins.id_users

LEFT JOIN cadastros
  ON cadastros.id = users.id_cadastros

LEFT JOIN funcionarios
  ON funcionarios.id = cadastros.id_funcionarios

LEFT JOIN fornecedores
  ON fornecedores.id = cadastros.id_fornecedores

LEFT JOIN clientes
  ON clientes.id = cadastros.id_clientes

LEFT JOIN consumidores
  ON consumidores.id = cadastros.id_consumidores

LEFT JOIN visitantes
  ON visitantes.id = cadastros.id_visitantes

LEFT JOIN empresas
  ON empresas.id = cadastros.id_empresas

ORDER BY logins.id ASC
`;

