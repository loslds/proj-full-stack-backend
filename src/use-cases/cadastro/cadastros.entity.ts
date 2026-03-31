
// C:\repository\proj-full-stack-backend\src\use-cases\cadastro\cadastros.entity.ts

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

import { EmpresasEntity } from '../empresa/empresas.entity';
import { VisitantesEntity } from '../visitante/visitantes.entity';
import { ConsumidoresEntity } from '../consumidor/consumidores.entity';
import { ClientesEntity } from '../cliente/clientes.entity';
import { FornecedoresEntity } from '../fornecedor/fornecedores.entity';
import { FuncionariosEntity } from '../funcionario/funcionarios.entity';
import { CidadesEntity } from '../cidade/cidades.entity';
import { ImagensEntity } from '../imagen/imagens.entity';

@Entity('cadastros')
@Index('idx_cadastros_id_empresas', ['id_empresas'])
@Index('idx_cadastros_id_visitantes', ['id_visitantes'])
@Index('idx_cadastros_id_consumidores', ['id_consumidores'])
@Index('idx_cadastros_id_clientes', ['id_clientes'])
@Index('idx_cadastros_id_fornecedores', ['id_fornecedores'])
@Index('idx_cadastros_id_funcionarios', ['id_funcionarios'])
@Index('idx_cadastros_id_cidades', ['id_cidades'])
@Index('idx_cadastros_id_imagens', ['id_imagens'])
@Index('idx_cadastros_cep', ['cep'])
export class CadastrosEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true
  })
  id: number;

  @Column({
    type: 'int',
    unsigned: true,
    nullable: false,
    default: 0
  })
  id_empresas: number;

  @ManyToOne(() => EmpresasEntity, {
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'id_empresas' })
  empresas: EmpresasEntity | null;

  @Column({
    type: 'int',
    unsigned: true,
    nullable: false,
    default: 0
  })
  id_visitantes: number;

  @ManyToOne(() => VisitantesEntity, {
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'id_visitantes' })
  visitantes: VisitantesEntity | null;

  @Column({
    type: 'int',
    unsigned: true,
    nullable: false,
    default: 0
  })
  id_consumidores: number;

  @ManyToOne(() => ConsumidoresEntity, {
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'id_consumidores' })
  consumidores: ConsumidoresEntity | null;

  @Column({
    type: 'int',
    unsigned: true,
    nullable: false,
    default: 0
  })
  id_clientes: number;

  @ManyToOne(() => ClientesEntity, {
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'id_clientes' })
  clientes: ClientesEntity | null;

  @Column({
    type: 'int',
    unsigned: true,
    nullable: false,
    default: 0
  })
  id_fornecedores: number;

  @ManyToOne(() => FornecedoresEntity, {
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'id_fornecedores' })
  fornecedores: FornecedoresEntity | null;

  @Column({
    type: 'int',
    unsigned: true,
    nullable: false,
    default: 0
  })
  id_funcionarios: number;

  @ManyToOne(() => FuncionariosEntity, {
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'id_funcionarios' })
  funcionarios: FuncionariosEntity | null;

  @Column({
    type: 'int',
    unsigned: true,
    nullable: false,
    default: 0
  })
  id_cidades: number;

  @ManyToOne(() => CidadesEntity, {
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'id_cidades' })
  cidades: CidadesEntity | null;

  // FK para imagens
  @Column({
    type: 'int',
    unsigned: true,
    nullable: true
  })
  id_imagens: number | null;

  // relacionamento
  @ManyToOne(() => ImagensEntity, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
  
  @JoinColumn({ name: 'id_imagens' })
  imagens: ImagensEntity | null;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    collation: 'utf8mb4_general_ci'
  })
  endereco: string | null;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    collation: 'utf8mb4_general_ci'
  })
  complemento: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    collation: 'utf8mb4_general_ci'
  })
  bairro: string | null;

  @Column({
    type: 'varchar',
    length: 8,
    nullable: true,
    collation: 'utf8mb4_general_ci'
  })
  cep: string | null;

  @Column({
    type: 'tinyint',
    width: 1,
    nullable: false,
    default: 0
  })
  has_email: number;

  @Column({
    type: 'tinyint',
    width: 1,
    nullable: false,
    default: 0
  })
  has_doc: number;

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