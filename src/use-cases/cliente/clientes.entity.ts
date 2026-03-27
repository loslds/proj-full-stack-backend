
// C:\repository\proj-full-stack-backend\src\use-cases\cliente\clientes.entity.ts

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

import { PessoasEntity } from '../pessoa/pessoas.entity';
import { EmpresasEntity } from '../empresa/empresas.entity';

@Entity('clientes')
@Unique(['nome', 'fantasy', 'id_pessoas', 'id_empresas'])
@Index('idx_clientes_nome', ['nome'])
@Index('idx_clientes_fantasy', ['fantasy'])
@Index('idx_clientes_id_pessoas', ['id_pessoas'])
@Index('idx_clientes_id_empresas', ['id_empresas'])
export class ClientesEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true, nullable: false, default: 0 })
  id_empresas: number;

  @ManyToOne(() => EmpresasEntity, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'id_empresas' })
  empresas: EmpresasEntity;

  @Column({ type: 'int', unsigned: true, nullable: false, default: 0 })
  id_pessoas: number;

  @ManyToOne(() => PessoasEntity, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'id_pessoas' })
  pessoas: PessoasEntity;

  @Column({ type: 'varchar', length: 60, collation: 'utf8mb4_general_ci' })
  nome: string;

  @Column({ type: 'varchar', length: 60, collation: 'utf8mb4_general_ci' })
  fantasy: string;

  @Column({ type: 'int', unsigned: true, default: 0 })
  createdBy: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @Column({ type: 'int', unsigned: true, default: 0 })
  updatedBy: number;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}