
//C:\repository\proj-full-stack-backend\src\config\db.ts
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { SystablesEntity } from '../use-cases/systable/systables.entity';
import { PessoasEntity } from './../use-cases/pessoa/pessoas.entity';
import { EstadosEntity } from './../use-cases/estado/estados.entity';
import { CidadesEntity } from './../use-cases/cidade/cidades.entity';
import { ImagensEntity } from './../use-cases/imagen/imagens.entity';
import { ModulosEntity } from './../use-cases/modulo/modulos.entity';
import { CargosEntity } from './../use-cases/cargo/cargos.entity';
import { AcoesEntity } from './../use-cases/acao/acoes.entity';
import { PerguntasEntity } from './../use-cases/perguntas/perguntas.entity';



export const dbConfig = {
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '123456',
  database: process.env.DB_NAME ?? 'sgb',
  charset: 'utf8mb4',
};

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '123456',
  database: process.env.DB_NAME ?? 'sgb',
  charset: 'utf8mb4',

  // ⚠️ SOMENTE a entity mínima do sistema
  entities: [
    SystablesEntity,
    PessoasEntity,
    EstadosEntity,
    CidadesEntity,
    ImagensEntity,
    ModulosEntity,
    CargosEntity,
    AcoesEntity,
    PerguntasEntity,
    
  ],
  synchronize: true,
  logging: true,
});
