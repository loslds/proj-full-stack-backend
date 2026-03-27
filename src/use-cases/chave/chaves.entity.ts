
//C:\repository\proj-full-stack-backend\src\use-cases\chave\chaves.entity.ts

// C:\repository\proj-full-stack-backend\src\use-cases\chave\chaves.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm';

import { UsersEntity } from '../user/users.entity';

@Entity('chaves')
@Index('idx_chaves_identificador', ['identificador'])
@Index('idx_chaves_id_users', ['id_users'])
@Index('idx_chaves_identificador_id_users', [
  'identificador',
  'id_users'
])
export class ChavesEntity {
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
  // DADOS DE AUTENTICAÇÃO
  // ==========================================================
  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
    collation: 'utf8mb4_general_ci'
  })
  identificador: string;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: false
  })
  psw_hash: string;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: false
  })
  min_hash: string;

  // ==========================================================
  // CONTROLE (OPCIONAL FUTURO)
  // ==========================================================
  @Column({
    type: 'boolean',
    default: true
  })
  ativo: boolean;

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