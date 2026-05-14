

// C:\repository\proj-full-stack-backend\src\use-cases\user\users.entity.ts

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm';

import { CadastrosEntity } from '../cadastro/cadastros.entity';

@Entity('users')
@Index('idx_users_id_cadastros', ['id_cadastros'])
export class UsersEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true
  })
  id: number;

  // ==========================================================
  // RELAÇÃO COM CADASTROS
  // ==========================================================
  @Column({
    type: 'int',
    unsigned: true,
    nullable: false,
    default: 0
  })
  id_cadastros: number;

  @ManyToOne(() => CadastrosEntity, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'id_cadastros' })
  cadastros: CadastrosEntity;

  // ==========================================================
  // CONTROLE DE USUÁRIO
  // ==========================================================
  
  @Column({
    type: 'tinyint',
    width: 1,
    nullable: false,
    default: 0
  })
  is_actived: number;

  // ==========================================================
  // AUDITORIA
  // ==========================================================
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

