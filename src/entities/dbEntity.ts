
 // src/user-case/start/dbEntyty.ts
import { SystablesEntity } from '../use-cases/systable/systables.entity';
import { PessoasEntity } from '../use-cases/pessoa/pessoas.entity';
import { ImagensEntity } from '../use-cases/imagen';
import { EmpresasEntity } from '../use-cases/empresa/empresas.entity';
import { ConsumidoresEntity } from '../use-cases/consumidor/consumidores.entity';

import { ClientesEntity } from '../use-cases/cliente/clientes.entity';
import { FornecedoresEntity } from '../use-cases/fornecedor/fornecedores.entity';
import { FuncionariosEntity } from '../use-cases/funcionario/funcionarios.entity';


export const dbEntity = [
  SystablesEntity,
  PessoasEntity,
  ImagensEntity,
  EmpresasEntity,
  ConsumidoresEntity,
  ClientesEntity,
  FornecedoresEntity,
  FuncionariosEntity,

  //
];


