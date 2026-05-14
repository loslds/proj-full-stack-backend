
// C:\repository\proj-full-stack-backend\src\services\utility\users\usersGridSelect.ts

export const usersGridSelect = `
SELECT
  users.id,
  users.id_cadastros,
  users.is_actived,

  cadastros.id AS cadastros_id,

  COALESCE(
    funcionarios.nome,
    fornecedores.nome,
    clientes.nome,
    consumidores.nome,
    visitantes.nome,
    empresas.nome
  ) AS nome

FROM users

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

ORDER BY users.id ASC
`;

