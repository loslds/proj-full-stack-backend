
//C:\repository\proj-full-stack-backend\src\services\utility\visitas\visitasGridSelect.ts

export const visitasGridSelect = `
SELECT
  v.id,
  v.id_visitantes,
  v.tempo_visitas,
  v.saidaAt,

  vi.nome AS visitante_nome,
  vi.fantasy AS visitante_fantasy

FROM visitas v

LEFT JOIN visitantes vi
  ON vi.id = v.id_visitantes

ORDER BY v.id ASC
`;
