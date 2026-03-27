
 
// C:\repository\proj-full-stack-backend\src\use-cases\estado\estados.entity.ts

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  Index,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('estados')
@Unique(['nome', 'prefixo']) // garante que não existam duplicados (nome + prefixo)
@Index('idx_estados_nome', ['nome'])
@Index('idx_estados_prefixo', ['prefixo'])

export class EstadosEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
    collation: 'utf8mb4_general_ci'
  })
  nome: string;

  @Column({
    type: 'varchar',
    length: 5,
    nullable: false,
    collation: 'utf8mb4_general_ci'
  })
  prefixo: string;

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