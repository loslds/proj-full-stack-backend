
//C:\repository\proj-full-stack-backend\src\services\utility\fones\mapFonesGridRow.ts

import { resolveCadastrosOrigem } from "../cadastros/resolveCadastrosOrigem";

export function mapFonesGridRow(row) {
  const origem = resolveCadastrosOrigem(row);

  return {
    id: row.id,

    id_origem: origem.id_origem,
    nome_origem: origem.origem_nome,

    id_cad: row.id_cad,

    fone_fixo: row.fone_fixo ?? "",
    fone_celular: row.fone_celular ?? "",
    fone_contacto: row.fone_contacto ?? "",
  };
}