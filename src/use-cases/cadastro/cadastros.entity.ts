// C:\repository\proj-full-stack-backend\src\use-cases\cadastro\cadastros.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

import { EmpresasEntity } from '../empresa/empresas.entity';
import { CidadesEntity } from '../cidade/cidades.entity';
import { ImagensEntity } from '../imagen/imagens.entity';
import { ConsumidoresEntity } from '../consumidor/consumidores.entity';
import { ClientesEntity } from '../cliente/clientes.entity';
import { FornecedoresEntity } from '../fornecedor/fornecedores.entity';
import { FuncionariosEntity } from '../funcionario/funcionarios.entity';

@Entity('cadastros')
export class CadastrosEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Index('idx_cadastros_grupo', ['grupo'])
  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
    collation: 'utf8mb4_general_ci'
  })
  grupo: string;

  @Index('idx_cadastros_status', ['status'])
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    default: 'ativo',
    collation: 'utf8mb4_general_ci'
  })
  status: string;

  @Column({ type: 'int', unsigned: true, nullable: false })
  id_empresas: number;

  @ManyToOne(() => EmpresasEntity)
  @JoinColumn({ name: 'id_empresas' })
  empresas: EmpresasEntity;

  @Column({ type: 'int', unsigned: true, nullable: false })
  id_consumidores: number;

  @ManyToOne(() => ConsumidoresEntity)
  @JoinColumn({ name: 'id_consumidores' })
  consumidores: ConsumidoresEntity;

  @Column({ type: 'int', unsigned: true, nullable: false })
  id_clientes: number;

  @ManyToOne(() => ClientesEntity)
  @JoinColumn({ name: 'id_clientes' })
  clientes: ClientesEntity;

  @Column({ type: 'int', unsigned: true, nullable: false })
  id_fornecedores: number;

  @ManyToOne(() => FornecedoresEntity)
  @JoinColumn({ name: 'id_fornecedores' })
  fornecedores: FornecedoresEntity;

  @Column({ type: 'int', unsigned: true, nullable: false })
  id_funcionarios: number;

  @ManyToOne(() => FuncionariosEntity)
  @JoinColumn({ name: 'id_funcionarios' })
  funcionarios: FuncionariosEntity;

  @Column({ type: 'int', unsigned: true, nullable: false })
  id_imagens: number;

  @ManyToOne(() => ImagensEntity)
  @JoinColumn({ name: 'id_imagens' })
  imagens: ImagensEntity;

  @Column({ type: 'int', unsigned: true, nullable: false })
  id_cidades: number;

  @ManyToOne(() => CidadesEntity)
  @JoinColumn({ name: 'id_cidades' })
  cidades: CidadesEntity;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
    collation: 'utf8mb4_general_ci'
  })
  endereco: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
    collation: 'utf8mb4_general_ci'
  })
  complemento: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    collation: 'utf8mb4_general_ci'
  })
  bairro: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
    collation: 'utf8mb4_general_ci'
  })
  cep: string;

  /**
   * Flag para indicar se o cadastro terá documento
   * 0 = não
   * 1 = sim
   */
  @Column({
    type: 'tinyint',
    width: 1,
    nullable: false,
    default: 0
  })
  has_doc: number;

  /**
   * Flag para indicar se o cadastro terá email
   * 0 = não
   * 1 = sim
   */
  @Column({
    type: 'tinyint',
    width: 1,
    nullable: false,
    default: 0
  })
  has_email: number;

  /**
   * Flag para indicar se o cadastro terá telefone
   * 0 = não
   * 1 = sim
   */
  @Column({
    type: 'tinyint',
    width: 1,
    nullable: false,
    default: 0
  })
  has_fone: number;

  @Column({
    type: 'int',
    unsigned: true,
    nullable: false,
    default: 0
  })
  createdBy: number;

  @CreateDateColumn({
    type: 'datetime'
  })
  createdAt: Date;

  @Column({
    type: 'int',
    unsigned: true,
    nullable: false,
    default: 0
  })
  updatedBy: number;

  @UpdateDateColumn({
    type: 'datetime'
  })
  updatedAt: Date;
}