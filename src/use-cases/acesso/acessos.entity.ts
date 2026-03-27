

// C:\repository\proj-full-stack-backend\src\use-cases\acesso\acessos.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm';

import { UsersEntity } from '../user/users.entity';

@Entity('acessos')
@Index('idx_acessos_id_users', ['id_users'])
export class AcessosEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true
  })
  id: number;

  // ==========================================================
  // RELAÇÃO COM USERS
  // ==========================================================
  @Column({
    type: 'int',
    unsigned: true,
    nullable: false,
    default: 0
  })
  id_users: number;

  @ManyToOne(() => UsersEntity, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'id_users' })
  users: UsersEntity;

  // ==========================================================
  // PERMISSÕES POR MÓDULO
  // Exemplo:
  // [
  //   {
  //     "modulo": "Recepcao",
  //     "cargo": "Supervisor",
  //     "acao": "Vis/List/Inc/Alt",
  //     "cor": "#0000ff",
  //     "nivel": 4
  //   }
  // ]
  // ==========================================================
  @Column({
    type: 'json',
    nullable: true
  })
  permissoes: {
    modulo: string;
    cargo: string;
    acao: string;
    cor: string;
    nivel: number;
  }[];

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

