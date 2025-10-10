// C:\repository\proj-full-stack-backend\src\use-cases\doc\docs.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { CadastrosEntity } from '../cadastro/cadastros.entity';

@Entity('docs')

export class DocsEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  // Relacionamento com a entidade CadastroEntity
  @ManyToOne(() => CadastrosEntity)
  @JoinColumn({ name: 'id_cadastro' })
  cadastros: CadastrosEntity;
  
  @Column({ type: 'int', nullable: false })
  id_cadastros: number;
  
  @Column({ type: 'varchar', length: 20, nullable: true })
  cpf: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  cnpj: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  inscre: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  inscrm: string;
  
  @Column({ type: 'varchar', length: 20, nullable: true })
  matricula: string;

  @Column({ type: 'int', nullable: true, unsigned: true, default: null })
    createdBy?: number;
  
  @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
  
  @Column({ type: 'int', nullable: true, unsigned: true, default: null })
    updatedBy?: number;
  
  @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
