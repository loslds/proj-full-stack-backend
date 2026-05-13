
// C:\repository\proj-full-stack-backend\src\use-cases\login\logins.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm';

import { UsersEntity } from '../user/users.entity';

@Entity('logins')
@Index('idx_logins_id_users', ['id_users'])
@Index('idx_logins_dt_login', ['dt_login'])
@Index('idx_logins_dt_logout', ['dt_logout'])
export class LoginsEntity {
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
  // AUDITORIA DE ACESSO AO SISTEMA
  // ==========================================================
  @Column({
    type: 'datetime',
    nullable: true,
    default: null
  })
  dt_login: Date | null;

  @Column({
    type: 'datetime',
    nullable: true,
    default: null
  })
  dt_logout: Date | null;

  @Column({
    type: 'int',
    unsigned: true,
    nullable: false,
    default: 0
  })
  tt_minutos: number;

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

