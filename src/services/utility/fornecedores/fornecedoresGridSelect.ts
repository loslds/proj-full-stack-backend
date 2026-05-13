
//C:\repository\proj-full-stack-backend\src\services\utility\fornecedores\fornecedoresGridSelect.ts

export const fornecedoresGridSelect = `
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

FROM fornecedores v

LEFT JOIN pessoas p
  ON p.id = v.id_pessoas

LEFT JOIN empresas e
  ON e.id = v.id_empresas

ORDER BY v.id ASC
`;
