
//C:\repository\proj-full-stack-backend\src\services\utility\fones\fonesGridSelect.ts

export const fonesGridSelect = `
SELECT
  f.id,
  f.id_cadastros AS id_cad,

  f.fone_fixo,
  f.fone_celular,
  f.fone_contacto,

  c.id_empresas,
  c.id_visitantes,
  c.id_consumidores,
  c.id_clientes,
  c.id_fornecedores,
  c.id_funcionarios,

  e.nome  AS empresas_nome,
  v.nome  AS visitantes_nome,
  co.nome AS consumidores_nome,
  cl.nome AS clientes_nome,
  fo.nome AS fornecedores_nome,
  fu.nome AS funcionarios_nome

FROM fones f

LEFT JOIN cadastros c
  ON c.id = f.id_cadastros

LEFT JOIN empresas e
  ON e.id = c.id_empresas

LEFT JOIN visitantes v
  ON v.id = c.id_visitantes

LEFT JOIN consumidores co
  ON co.id = c.id_consumidores

LEFT JOIN clientes cl
  ON cl.id = c.id_clientes

LEFT JOIN fornecedores fo
  ON fo.id = c.id_fornecedores

LEFT JOIN funcionarios fu
  ON fu.id = c.id_funcionarios

ORDER BY f.id ASC
`;