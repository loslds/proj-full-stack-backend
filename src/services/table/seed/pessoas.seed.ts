
// C:\repository\proj-full-stack-backend\src\services\table\seed\pessoas.seed.ts
type PessoasSeedType = {
  nome: string;
  sigla: string;
  createdBy?: number;
  updatedBy?: number;
};
export const pessoasSeed: PessoasSeedType[] = [
  { nome: 'Pessoa Física', sigla: 'PF', createdBy: 0, updatedBy: 0 },
  { nome: 'Pessoa Jurídica', sigla: 'PJ', createdBy: 0, updatedBy: 0 }
];

