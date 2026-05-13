
//C:\repository\proj-full-stack-backend\src\services\utility\emails\mapEmailsGridRow.ts

import { resolveCadastrosOrigem } from "../cadastros/resolveCadastrosOrigem"


export function mapEmailsGridRow(row) {
  const origem = resolveCadastrosOrigem(row);
  

  return {
    id: row.id,

    id_origem: origem.id_origem,
    nome_origem: origem.origem_nome,

    id_cad: row.id_cad,
    email: row.email,
  };
}