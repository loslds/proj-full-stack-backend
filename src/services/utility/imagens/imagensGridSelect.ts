
//C:\repository\proj-full-stack-backend\src\services\utility\imagens\imagensGridSelect.ts
export const imagensGridSelect = `
SELECT
  id,
  nome,
  tipo,
  path_origem,
  path_dest,
  svg

FROM imagens

ORDER BY id ASC
`;