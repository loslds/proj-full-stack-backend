
//C:\repository\proj-full-stack-backend\src\services\utility\cadastros\mapCadastroGridRow.ts
import { resolveCadastrosOrigem } from "./resolveCadastrosOrigem";

export function mapCadastrosGridRow(row) {
  const origem = resolveCadastrosOrigem(row);

  return {
    id: row.id,

    id_origem: origem.id_origem,
    tab_nome: origem.tab_nome,
    origem_nome: origem.origem_nome,

    has_email: Boolean(row.has_email),
    has_doc: Boolean(row.has_doc),
    has_fone: Boolean(row.has_fone),
  };
}