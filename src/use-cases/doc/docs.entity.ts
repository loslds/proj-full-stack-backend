

// C:\repository\proj-full-stack-backend\src\use-cases\doc\docs.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique
} from 'typeorm';

import { CadastrosEntity } from '../cadastro/cadastros.entity';

@Entity('docs')
@Unique(['cpf'])
@Unique(['cnpj'])
@Unique(['inscr_estadual'])
@Unique(['inscr_municipal'])
@Index('idx_docs_id_cadastros', ['id_cadastros'])
@Index('idx_docs_cpf', ['cpf'])
@Index('idx_docs_cnpj', ['cnpj'])
@Index('idx_docs_inscr_estadual', ['inscr_estadual'])
@Index('idx_docs_inscr_municipal', ['inscr_municipal'])
export class DocsEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true
  })
  id: number;

  // ============================================================
  // RELAÇÃO COM CADASTROS
  // ============================================================
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

  // ============================================================
  // CAMPOS
  // ============================================================
  @Column({
    type: 'varchar',
    length: 14,
    nullable: true,
    collation: 'utf8mb4_general_ci'
  })
  cpf: string | null;

  @Column({
    type: 'varchar',
    length: 18,
    nullable: true,
    collation: 'utf8mb4_general_ci'
  })
  cnpj: string | null;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    collation: 'utf8mb4_general_ci'
  })
  inscr_estadual: string | null;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    collation: 'utf8mb4_general_ci'
  })
  inscr_municipal: string | null;

  // ============================================================
  // AUDITORIA
  // ============================================================
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