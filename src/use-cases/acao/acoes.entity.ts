
//C:\repository\proj-full-stack-backend\src\use-cases\acao\acoes.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique
} from 'typeorm';

@Entity('acoes')
@Unique(['nome'])
@Unique(['abrev'])
@Unique(['nivel'])
export class AcoesEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true
  })
  id: number;

  /**
   * Nome da ação
   */
  @Column({
    type: 'varchar',
    length: 55,
    nullable: false,
    collation: 'utf8mb4_general_ci'
  })
  nome: string;

  /**
   * Abreviação
   * Ex: Vis, Vis/List, etc
   */
  @Column({
    type: 'varchar',
    length: 25,
    nullable: false,
    collation: 'utf8mb4_general_ci'
  })
  abrev: string;

  /**
   * Cor da ação (UI)
   */
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    collation: 'utf8mb4_general_ci'
  })
  cor: string;

  /**
   * Nível da ação (1 a 5)
   */
  @Column({
    type: 'tinyint',
    unsigned: true,
    nullable: false
  })
  nivel: number;

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