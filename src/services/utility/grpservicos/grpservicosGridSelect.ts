
//C:\repository\proj-full-stack-backend\src\services\utility\grpservicos\grpservicosGridSelect.ts

export const grpservicosGridSelect = `
SELECT
  e.id,
  e.id_servicos,
  p.nome AS servicos_nome,
  e.nome,

FROM grpservicos e

LEFT JOIN servicos p
  ON p.id = e.id_servicos
`;
