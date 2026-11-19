
// C:\repository\proj-full-stack-backend\src\use-cases\grpservico\grpservicos.entity.ts

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique
} from 'typeorm';

import { ServicosEntity } from '../servico/servicos.entity';


@Entity('grpservicos')
// Nomes iguais aos do banco (uk_/idx_/fk_) para o synchronize não recriar índices
@Unique('uk_grpservicos_nome_servico', ['nome', 'id_servicos'])
@Index('idx_grpservicos_nome', ['nome'])
@Index('idx_grpservicos_id_servicos', ['id_servicos'])
export class GrpServicosEntity {

  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true
  })
  id: number;


  @Column({
    type: 'int',
    unsigned: true,
    nullable: false
  })
  id_servicos: number;


  @ManyToOne(() => ServicosEntity, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'id_servicos', foreignKeyConstraintName: 'fk_grpservicos_servicos' })
  servicos: ServicosEntity;


  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    collation: 'utf8mb4_general_ci'
  })
  nome: string;


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
    nullable: false,
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