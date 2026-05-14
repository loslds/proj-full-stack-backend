

// C:\repository\proj-full-stack-backend\src\services\utility\pergsresps\pergsrespsGridSelect.ts

export const pergsrespsGridSelect = `
SELECT
  pergsresps.id,

  pergsresps.id_chaves,

  pergsresps.pergunta1,
  pergsresps.resposta1,

  pergsresps.pergunta2,
  pergsresps.resposta2,

  pergsresps.pergunta3,
  pergsresps.resposta3,

  chaves.identificador,

  users.id AS users_id,

  COALESCE(
    funcionarios.nome,
    fornecedores.nome,
    clientes.nome,
    consumidores.nome,
    visitantes.nome,
    empresas.nome
  ) AS nome

FROM pergsresps

LEFT JOIN chaves
  ON chaves.id = pergsresps.id_chaves

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

ORDER BY pergsresps.id ASC
`;

