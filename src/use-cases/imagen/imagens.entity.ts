
// //C:\repository\proj-full-stack-backend\src\use-cases\imagen\imagens.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

import { EmpresasEntity } from '../empresa/empresas.entity';
import { ConsumidoresEntity } from '../consumidor/consumidores.entity';
import { ClientesEntity } from '../cliente/clientes.entity';
import { FornecedoresEntity } from '../fornecedor/fornecedores.entity';
import { FuncionariosEntity } from '../funcionario/funcionarios.entity';

// =============================
// ENUMS NUMÉRICOS - TIPAGEM TS
// =============================

export enum ArqTipoEnum {
  DEFAULT = 1,
  LOGO = 2,
  PAINEL = 3,
  AVATAR = 4,
  BOTAO = 5,
}

export enum ArqAcaoEnum {
  VISUALIZA = 1,
  CADASTRO = 2,
  INCLUSAO = 3,
  ALTERACAO = 4,
  EXCLUSAO = 5,
  LISTAGEM = 6,
  HELP = 7,
}

@Entity('imagens')
@Unique(['arqNome', 'arqTipo', 'arqPage']) // garante que não existam conflitos por página
export class ImagensEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  // ================================
  // 🔹 Relacionamentos referenciais
  // ================================

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

  // ================================
  // 🧱 Campos de controle de imagem
  // ================================

  @Column({ type: 'int', unsigned: true, default: 0 })
  id_default: number;

  @Column({
    type: 'tinyint',
    unsigned: true,
    nullable: false,
    comment: '1=default, 2=logo, 3=painel, 4=avatar, 5=botao',
  })
  arqTipo: ArqTipoEnum;

  @Column({
    type: 'tinyint',
    unsigned: true,
    nullable: false,
    comment: '1=visualiza, 2=cadastro, 3=inclusao, 4=alteracao, 5=exclusao, 6=listagem, 7=help',
  })
  arqAcao: ArqAcaoEnum;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    collation: 'utf8mb4_general_ci',
  })
  arqPage?: string | null;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    collation: 'utf8mb4_general_ci',
  })
  arqNome: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    collation: 'utf8mb4_general_ci',
  })
  arqPath: string;

  @Column({ type: 'longblob', nullable: true })
  arqBlob?: Buffer | string | null;

  // ================================
  // 🕓 Controle de criação/atualização
  // ================================

  @Column({ type: 'int', unsigned: true, nullable: false, default: 0 })
  createBy: number;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @Column({ type: 'int', unsigned: true, nullable: false, default: 0 })
  updateBy: number;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;
}






















// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   JoinColumn,
//   CreateDateColumn,
//   UpdateDateColumn,
//   Unique
// } from 'typeorm';

// import { EmpresasEntity } from '../empresa/empresas.entity';
// import { ConsumidoresEntity } from '../consumidor/consumidores.entity';
// import { ClientesEntity } from '../cliente/clientes.entity';
// import { FornecedoresEntity } from '../fornecedor/fornecedores.entity';
// import { FuncionariosEntity } from '../funcionario/funcionarios.entity';
// @Entity('imagens')
// @Unique(['arqNome', 'arqTipo', 'arqPage']) // garante que não existam conflitos por página

// export class ImagensEntity {
//   @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
//   id: number;

//   // 🔹 Campo para armazenar o id relacionados
//   @Column({ type: 'int', unsigned: true, nullable: false })
//   id_empresas: number;
//   // 🔹 Relacionamento com empresas
//   @ManyToOne(() => EmpresasEntity)
//   @JoinColumn({ name: 'id_empresas' })
//   empresas: EmpresasEntity;
  
//   // 🔹 Campo para armazenar o id consumidores
//   @Column({ type: 'int', unsigned: true, nullable: false })
//   id_consumidores: number;
  
//   // 🔹 Relacionamento com consumidores
//   @ManyToOne(() => ConsumidoresEntity)
//   @JoinColumn({ name: 'id_consumidores' })
//   consumidores: ConsumidoresEntity;
  
//   // 🔹 Campo para armazenar o id clientes
//   @Column({ type: 'int', unsigned: true, nullable: false })
//   id_clientes: number;
  
//   // 🔹 Relacionamento com consumidores
//   @ManyToOne(() => ClientesEntity)
//   @JoinColumn({ name: 'id_clientes' })
//   clientes: ClientesEntity;
  
//   // 🔹 Campo para armazenar o id fornecedores
//   @Column({ type: 'int', unsigned: true, nullable: false })
//   id_fornecedores: number;
  
//   // 🔹 Relacionamento com fornecedores
//   @ManyToOne(() => FornecedoresEntity)
//   @JoinColumn({ name: 'id_fornecedores' })
//   fornecedores: FornecedoresEntity;
  
//   // 🔹 Campo para armazenar o id funcionarios
//   @Column({ type: 'int', unsigned: true, nullable: false })
//   id_funcionarios: number;
  
//   // 🔹 Relacionamento com consumidores
//   @ManyToOne(() => FuncionariosEntity)
//   @JoinColumn({ name: 'id_funcionarios' })
//   funcionarios: FuncionariosEntity;

//   @Column({ type: 'int', unsigned: true, default: 0 })
//   id_default: number;

//   @Column({
//     type: 'enum',
//     enum: [
//       'default',
//       'logo',
//       'painel',
//       'avatar',
//       'botao',
//     ],
//     enumName: 'imagens_arqtipo_enum', // opcional, útil para migrations
//     nullable: false,
//   })
//   arqTipo: string; // tipagem no TS será controlada pelo DTO

//   @Column({
//     type: 'enum',
//     enum: [
//       'visualiza',
//       'cadastro',
//       'inclusao',
//       'alteracao',
//       'exclusao',
//       'listagem',
//       'help',
//     ],
//     enumName: 'imagens_arqacao_enum', // opcional, útil para migrations
//     nullable: false,
//   })
//   arqAcao: string; // tipagem no TS será controlada pelo DTO

//   // Nome da página ou contexto onde a imagem será usada
//   @Column({
//     type: 'varchar',
//     length: 100,
//     nullable: true,
//     collation: 'utf8mb4_general_ci',
//   })
//   arqPage?: string | null;

//   @Column({
//     type: 'varchar',
//     length: 150,
//     nullable: false,
//     collation: 'utf8mb4_general_ci',
//   })
//   arqNome: string;

//   @Column({
//     type: 'varchar',
//     length: 255,
//     nullable: false,
//     collation: 'utf8mb4_general_ci',
//   })
//   arqPath: string;

//   @Column({ type: 'longblob', nullable: true })
//   arqBlob?: Buffer | string | null;

//   @Column({ type: 'int', unsigned: true, nullable: false, default: 0 })
//   createBy: number;

//   @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
//   createAt: Date;

//   @Column({ type: 'int', unsigned: true, nullable: false, default: 0 })
//   updateBy: number;

//   @UpdateDateColumn({
//     type: 'datetime',
//     default: () => 'CURRENT_TIMESTAMP',
//     onUpdate: 'CURRENT_TIMESTAMP',
//   })
//   updateAt: Date;
// }