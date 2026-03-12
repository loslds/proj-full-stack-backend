
// src/use-cases/imagens/imagens.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm';
@Entity('imagens')
@Unique(['nome'])
export class ImagensEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 180,
    nullable: false,
    collation: 'utf8mb4_general_ci'
  })
  nome: string;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
    collation: 'utf8mb4_general_ci'
  })
  tipo: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    collation: 'utf8mb4_general_ci'
  })
  path_origem: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    collation: 'utf8mb4_general_ci'
  })
  path_dest: string | null;

  @Column({
    type: 'longtext',
    nullable: false,
    collation: 'utf8mb4_general_ci'
  })
  svg: string;

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