
//C:\repository\proj-full-stack-backend\src\services\utility\cidades\cidadesGridSelect.ts

export const cidadesGridSelect = `
SELECT
  c.id,
  c.nome,
  c.id_estados,

  e.id AS estado_id,
  e.nome AS estado_nome,
  e.prefixo AS estado_prefixo

FROM cidades c

LEFT JOIN estados e
  ON e.id = c.id_estados

ORDER BY c.nome ASC
`;