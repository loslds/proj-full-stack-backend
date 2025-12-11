//C:\repository\proj-full-stack-backend\src\use-cases\cliente\clientes.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique
} from 'typeorm';

import { EmpresasEntity } from '../empresa/empresas.entity';
import { CidadesEntity } from '../cidade/cidades.entity';
import { ImagensEntity } from '../imagen/imagens.entity';
import { ConsumidoresEntity } from '../consumidor/consumidores.entity';
import { ClientesEntity } from '../cliente/clientes.entity';
import { FornecedoresEntity } from '../fornecedor/fornecedores.entity';
import { FuncionariosEntity } from '../funcionario/funcionarios.entity';

@Entity('cadastros')
@Unique(['nome']) // garante que não tenha dois iguais

export class CadastrosEntity {
  
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  // 🔹 Campo para armazenar o id relacionados
  @Column({ type: 'int', unsigned: true, nullable: false })
  id_empresas: number;
  // 🔹 Relacionamento com empresas
  @ManyToOne(() => EmpresasEntity)
  @JoinColumn({ name: 'id_empresas' })
  empresas: EmpresasEntity;

  // 🔹 Campo para armazenar o id consumidores
  @Column({ type: 'int', unsigned: true, nullable: false })
  id_consumidores: number;

  // 🔹 Relacionamento com consumidores
  @ManyToOne(() => ConsumidoresEntity)
  @JoinColumn({ name: 'id_consumidores' })
  consumidores: ConsumidoresEntity;

  // 🔹 Campo para armazenar o id clientes
  @Column({ type: 'int', unsigned: true, nullable: false })
  id_clientes: number;

  // 🔹 Relacionamento com consumidores
  @ManyToOne(() => ClientesEntity)
  @JoinColumn({ name: 'id_clientes' })
  clientes: ClientesEntity;

// 🔹 Campo para armazenar o id fornecedores
  @Column({ type: 'int', unsigned: true, nullable: false })
  id_fornecedores: number;

  // 🔹 Relacionamento com fornecedores
  @ManyToOne(() => FornecedoresEntity)
  @JoinColumn({ name: 'id_fornecedores' })
  fornecedores: FornecedoresEntity;

// 🔹 Campo para armazenar o id funcionarios
  @Column({ type: 'int', unsigned: true, nullable: false })
  id_funcionarios: number;

  // 🔹 Relacionamento com consumidores
  @ManyToOne(() => FuncionariosEntity)
  @JoinColumn({ name: 'id_funcionarios' })
  funcionarios: FuncionariosEntity;

// 🔹 Campo para armazenar o id imagens
  @Column({ type: 'int', unsigned: true, nullable: false })
  id_imagens: number;

  // 🔹 Relacionamento com imagens
  @ManyToOne(() => ImagensEntity)
  @JoinColumn({ name: 'id_imagens' })
  imagens: ImagensEntity;

  // 🔹 Campo para armazenar o id cidades
  @Column({ type: 'int', unsigned: true, nullable: false })
  id_cidades: number;

  // 🔹 Relacionamento com imagens
  @ManyToOne(() => CidadesEntity)
  @JoinColumn({ name: 'id_cidades' })
  cidades: ImagensEntity;

  // 🔹 Campo para informações do cadastros
  @Column({ 
    type: 'varchar', 
    length: 200, 
    nullable: false 
  })
  endereco: string;

  @Column({ 
    type: 'varchar', 
    length: 200, 
    nullable: false 
  })
  complemento: string;

  @Column({ 
    type: 'varchar', 
    length: 100, 
    nullable: false 
  })
  bairro: string;

  // 🔹 Campo para informações da Criação e Update do Registro
  @Column({ 
    type: 'int', 
    unsigned: true, 
    nullable: false, 
    default: 0 
  })
  createdBy: number;

  @Column({ 
    type: 'datetime', 
    nullable: true, 
    default: () => 'CURRENT_TIMESTAMP' 
  })
  createdAt: Date;

  @Column({ 
    type: 'int', 
    unsigned: true, 
    nullable: true, 
    default: 0 
  })
  updatedBy: number;

  @Column({ 
    type: 'datetime', 
    nullable: true, 
    default: () => 'CURRENT_TIMESTAMP', 
    onUpdate: 'CURRENT_TIMESTAMP' 
  })
  updatedAt: Date;
}
