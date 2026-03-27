
//C:\repository\proj-full-stack-backend\src\services\table\seed\cargos.seed.ts
type CargosSeedType = {
  nome: string;
  createdBy?: number;
  updatedBy?: number;
};
export const cargosSeed: CargosSeedType[] = [
  { nome: 'Junior', createdBy: 0, updatedBy: 0 },
  { nome: 'Pleno', createdBy: 0, updatedBy: 0 },
  { nome: 'Senior', createdBy: 0, updatedBy: 0 },
  { nome: 'Supervisor', createdBy: 0, updatedBy: 0 },
  { nome: 'Administrador', createdBy: 0, updatedBy: 0 }
];
