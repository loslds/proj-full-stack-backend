
// C:\repository\proj-full-stack-backend\src\services\table\seed\servicos.seed.ts
type ServicosSeedType = {
  id: number;
  nome: string;
  createdBy?: number;
  updatedBy?: number;
};
export const servicosSeed: ServicosSeedType[] = [
  { id: 1, nome: 'Design', createdBy: 0, updatedBy: 0 },
  { id: 2, nome: 'Bordados', createdBy: 0, updatedBy: 0 },
  { id: 3, nome: 'DTF (Termo colante)', createdBy: 0, updatedBy: 0 },
  { id: 4, nome: 'Adesivo UV', createdBy: 0, updatedBy: 0 },
  { id: 5, nome: 'Corte a Laser', createdBy: 0, updatedBy: 0 },
  { id: 6, nome: 'Corte Lase e Gravação', createdBy: 0, updatedBy: 0 },
  { id: 7, nome: 'Gravação', createdBy: 0, updatedBy: 0 },
  { id: 8, nome: 'Silkscreen', createdBy: 0, updatedBy: 0 }
];

