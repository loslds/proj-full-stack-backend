
//C:\repository\proj-full-stack-backend\src\services\utility\visitas\mapVisitasGrid.ts

export function mapVisitasGridRow(row) {
  return {
    id: row.id,

    id_visitantes: row.id_visitantes,

    visitante_nome: row.visitante_nome ?? "",
    visitante_fantasy: row.visitante_fantasy ?? "",

    tempo_visitas: row.tempo_visitas,
    saidaAt: row.saidaAt,
  };
}
