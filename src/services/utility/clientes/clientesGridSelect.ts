
//C:\repository\proj-full-stack-backend\src\services\utility\clientes\clientesGridSelect.ts

export const clientesGridSelect = `
SELECT
  v.id,
  v.id_pessoas,
  v.id_empresas,

  p.nome AS pessoa_nome,
  p.sigla AS pessoa_sigla,

  e.nome AS empresa_nome,
  e.fantasy AS empresa_fantasy,

  v.nome,
  v.fantasy

FROM clientes v

LEFT JOIN pessoas p
  ON p.id = v.id_pessoas

LEFT JOIN empresas e
  ON e.id = v.id_empresas

ORDER BY v.id ASC
`;
