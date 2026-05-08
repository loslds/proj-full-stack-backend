
//C:\repository\proj-full-stack-backend\src\services\utility\empresas\empresaGridSelect.ts

export const empresaGridSelect = `
SELECT
  e.id,
  e.id_pessoas,
  p.nome AS pessoa_nome,
  p.sigla AS pessoa_sigla,
  e.nome,
  e.fantasy

FROM empresas e

LEFT JOIN pessoas p
  ON p.id = e.id_pessoas
`;
