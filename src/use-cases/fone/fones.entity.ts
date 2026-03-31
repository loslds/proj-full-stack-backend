

// C:\repository\proj-full-stack-backend\src\use-cases\fone\fones.entity.ts
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

@Entity('fones')
@Unique(['fone_fixo'])
@Unique(['fone_celular'])
@Index('idx_fones_id_cadastros', ['id_cadastros'])
@Index('idx_fones_fone_fixo', ['fone_fixo'])
@Index('idx_fones_fone_celular', ['fone_celular'])
@Index('idx_fones_fone_contacto', ['fone_contacto'])
export class FonesEntity {
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
    length: 10,
    nullable: true,
    collation: 'utf8mb4_general_ci'
  })
  fone_fixo: string | null;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
    collation: 'utf8mb4_general_ci'
  })
  fone_celular: string | null;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
    collation: 'utf8mb4_general_ci'
  })
  fone_contacto: string | null;

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
