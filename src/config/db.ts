
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
import { EmpresasEntity } from './../use-cases/empresa/empresas.entity';
import { VisitantesEntity } from './../use-cases/visitante/visitantes.entity';
import { VisitasEntity } from './../use-cases/visita/visitas.entity';
import { ConsumidoresEntity } from './../use-cases/consumidor/consumidores.entity';
import { ClientesEntity } from './../use-cases/cliente/clientes.entity';
import { FornecedoresEntity } from './../use-cases/fornecedor/fornecedores.entity';
import { FuncionariosEntity } from './../use-cases/funcionario/funcionarios.entity';
import { CadastrosEntity } from './../use-cases/cadastro/cadastros.entity';
import { EmailsEntity } from './../use-cases/email/emails.entity';
import { DocsEntity } from './../use-cases/doc/docs.entity';
import { FonesEntity } from './../use-cases/fone/fones.entity';

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
    EmpresasEntity, 
    VisitantesEntity,
    VisitasEntity,      
    ConsumidoresEntity,
    ClientesEntity,
    FornecedoresEntity,
    FuncionariosEntity,
    CadastrosEntity,
    EmailsEntity,
    DocsEntity,
    FonesEntity,
      
  ],
  synchronize: true,
  logging: true,
});
