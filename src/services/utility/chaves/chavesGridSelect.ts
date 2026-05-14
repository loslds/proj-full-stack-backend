
// C:\repository\proj-full-stack-backend\src\services\utility\chaves\chavesGridSelect.ts

export const chavesGridSelect = `
SELECT
  chaves.id,

  chaves.id_users,

  chaves.identificador,

  chaves.psw_hash,

  chaves.min_hash,

  chaves.ativo,

  users.is_actived,

  COALESCE(
    funcionarios.nome,
    fornecedores.nome,
    clientes.nome,
    consumidores.nome,
    visitantes.nome,
    empresas.nome
  ) AS nome

FROM chaves

LEFT JOIN users
  ON users.id = chaves.id_users

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

ORDER BY chaves.id ASC
`;


