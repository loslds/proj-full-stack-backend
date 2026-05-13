
//C:\repository\proj-full-stack-backend\src\services\utility\acoes\acoesGridSelect.ts

export const acoesGridSelect = `
SELECT
  id,
  nome,
  abrev,
  cor,
  nivel

FROM acoes

ORDER BY nome ASC
`;