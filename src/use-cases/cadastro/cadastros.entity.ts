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
  @Column({ type: 'int', nullable: false })
  id_empresas: number;
  // 🔹 Relacionamento com empresas
  @ManyToOne(() => EmpresasEntity)
  @JoinColumn({ name: 'id_empresas' })
  empresas: EmpresasEntity;

  // 🔹 Campo para armazenar o id consumidores
  @Column({ type: 'int', nullable: false })
  id_consumidores: number;

  // 🔹 Relacionamento com consumidores
  @ManyToOne(() => ConsumidoresEntity)
  @JoinColumn({ name: 'id_consumidores' })
  consumidores: ConsumidoresEntity;

  // 🔹 Campo para armazenar o id clientes
  @Column({ type: 'int', nullable: false })
  id_clientes: number;

  // 🔹 Relacionamento com consumidores
  @ManyToOne(() => ClientesEntity)
  @JoinColumn({ name: 'id_clientes' })
  clientes: ClientesEntity;

// 🔹 Campo para armazenar o id fornecedores
  @Column({ type: 'int', nullable: false })
  id_fornecedores: number;

  // 🔹 Relacionamento com fornecedores
  @ManyToOne(() => FornecedoresEntity)
  @JoinColumn({ name: 'id_fornecedores' })
  fornecedores: FornecedoresEntity;

// 🔹 Campo para armazenar o id funcionarios
  @Column({ type: 'int', nullable: false })
  id_funcionarios: number;

  // 🔹 Relacionamento com consumidores
  @ManyToOne(() => FuncionariosEntity)
  @JoinColumn({ name: 'id_funcionarios' })
  funcionarios: FuncionariosEntity;

  @Column({ type: 'varchar', length: 200, nullable: false })
  endereco: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  complemento: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  bairro: string;

  @Column({ type: 'int', nullable: true, unsigned: true, default: null })
  createdBy?: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'int', nullable: true, unsigned: true, default: null })
  updatedBy?: number;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
