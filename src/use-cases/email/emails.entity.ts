
// C:\repository\proj-full-stack-backend\src\use-cases\email\emails.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index
} from 'typeorm';

import { CadastrosEntity } from '../cadastro/cadastros.entity';

@Entity('emails')
@Unique(['email'])
@Index('idx_emails_email', ['email'])
@Index('idx_emails_email_resgate', ['email_resgate'])
@Index('idx_emails_id_cadastros', ['id_cadastros'])
@Index('idx_emails_email_resgate_id_cadastros', [
  'email',
  'email_resgate',
  'id_cadastros'
])
export class EmailsEntity {
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
    length: 120,
    nullable: false,
    collation: 'utf8mb4_general_ci'
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 120,
    nullable: true,
    collation: 'utf8mb4_general_ci'
  })
  email_resgate: string | null;

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