// C:\repository\proj-full-stack-backend\src\use-cases\pessoa\pessoas.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  Index
} from 'typeorm';

@Entity('pessoas')
@Unique(['nome', 'sigla']) // garante que não existam duplicados (nome + sigla)
@Index('idx_pessoas_nome', ['nome'])
@Index('idx_pessoas_sigla', ['sigla'])
export class PessoasEntity {
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
  sigla: string;

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