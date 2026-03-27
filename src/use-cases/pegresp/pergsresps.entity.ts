

// C:\repository\proj-full-stack-backend\src\use-cases\pespsperg\pespspergs.entity.ts

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm';

import { ChavesEntity } from '../chave/chaves.entity';

@Entity('pespspergs')
@Index('idx_pespspergs_id_chaves', ['id_chaves'])
export class PegsRespsEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true
  })
  id: number;

  // ==========================================================
  // RELAÇÃO COM CHAVES
  // ==========================================================
  @Column({
    type: 'int',
    unsigned: true,
    nullable: false,
    default: 0
  })
  id_chaves: number;

  @ManyToOne(() => ChavesEntity, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'id_chaves' })
  chaves: ChavesEntity;

  // ==========================================================
  // PERGUNTAS E RESPOSTAS
  // ==========================================================
  @Column({
    type: 'varchar',
    length: 120,
    nullable: false,
    collation: 'utf8mb4_general_ci'
  })
  pergunta1: string;

  @Column({
    type: 'varchar',
    length: 120,
    nullable: false,
    collation: 'utf8mb4_general_ci'
  })
  resposta1: string;

  @Column({
    type: 'varchar',
    length: 120,
    nullable: false,
    collation: 'utf8mb4_general_ci'
  })
  pergunta2: string;

  @Column({
    type: 'varchar',
    length: 120,
    nullable: false,
    collation: 'utf8mb4_general_ci'
  })
  resposta2: string;

  @Column({
    type: 'varchar',
    length: 120,
    nullable: false,
    collation: 'utf8mb4_general_ci'
  })
  pergunta3: string;

  @Column({
    type: 'varchar',
    length: 120,
    nullable: false,
    collation: 'utf8mb4_general_ci'
  })
  resposta3: string;

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