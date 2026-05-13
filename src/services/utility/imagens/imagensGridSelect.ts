
//C:\repository\proj-full-stack-backend\src\services\utility\imagens\imagensGridSelect.ts

export const imagensGridSelect = `
SELECT
  id,
  nome,
  tipo,
  svg

FROM imagens

ORDER BY id ASC
`;