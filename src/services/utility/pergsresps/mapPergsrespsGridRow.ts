
// C:\repository\proj-full-stack-backend\src\services\utility\pergsresps\mapPergsrespsGridRow.ts

export function mapPergsrespsGridRow(row: any) {
  return {
    id: row.id,

    id_chaves: row.id_chaves,

    identificador: row.identificador,

    users_id: row.users_id,

    nome: row.nome,

    pergunta1: row.pergunta1,
    resposta1: row.resposta1,

    pergunta2: row.pergunta2,
    resposta2: row.resposta2,

    pergunta3: row.pergunta3,
    resposta3: row.resposta3
  };
}

