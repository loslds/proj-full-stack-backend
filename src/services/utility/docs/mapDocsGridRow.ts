
//

import { resolveCadastrosOrigem } from "../cadastros/resolveCadastrosOrigem";

export function mapDocsGridRow(row) {
  const origem = resolveCadastrosOrigem(row);

  return {
    id: row.id,

    id_origem: origem.id_origem,
    nome_origem: origem.origem_nome,

    id_cad: row.id_cad,

    cpf: row.cpf ?? "",
    cnpj: row.cnpj ?? "",
  };
}