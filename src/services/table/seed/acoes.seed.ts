


// C:\repository\proj-full-stack-backend\src\services\table\seed\acoes.seed.ts
type AcoesSeedType = {
  nome: string;
  abrev: string;
  cor: string;
  nivel: number;
  createdBy?: number;
  updatedBy?: number;
};
export const acoesSeed: AcoesSeedType[] = [
  {
    nome: 'Visualização',
    abrev: 'Vis',
    cor: '#FF0000', // Vermelho
    nivel: 1,
    createdBy: 0, 
    updatedBy: 0 
  },
  {
    nome: 'Visualização, Listagem',
    abrev: 'Vis/List',
    cor: '#FFFF00', // Amarelo
    nivel: 2,
    createdBy: 0, 
    updatedBy: 0 
  },
  {
    nome: 'Visualização, Listagem, Inclusão',
    abrev: 'Vis/List/Inc',
    cor: '#00FFFF', // Ciano
    nivel: 3,
    createdBy: 0, 
    updatedBy: 0 

  },
  {
    nome: 'Visualização, Listagem, Inclusão, Alteração',
    abrev: 'Vis/List/Inc/Alt',
    cor: '#0000FF', // Azul
    nivel: 4,
    createdBy: 0, 
    updatedBy: 0 
  },
  {
    nome: 'Visualização, Listagem, Inclusão, Alteração, Exclusão',
    abrev: 'Vis/List/Inc/Alt/Exc',
    cor: '#008000', // Verde
    nivel: 5,
    createdBy: 0, 
    updatedBy: 0 
  }
];

