
// C:\repository\proj-full-stack-backend\src\use-cases\funcionarios\funcionarios.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm';

import { PessoasEntity } from '../pessoa/pessoas.entity';
import { EmpresasEntity } from '../empresa/empresas.entity';

@Entity('funcionarios')
@Index('idx_funcionarios_nome', ['nome'])
@Index('idx_funcionarios_fantasy', ['fantasy'])
@Index('idx_funcionarios_id_pessoas', ['id_pessoas'])
@Index('idx_funcionarios_id_empresas', ['id_empresas'])
@Index('idx_funcionarios_nome_fantasy_id_pessoas_id_empresas', [
  'nome',
  'fantasy',
  'id_pessoas',
  'id_empresas'
])
export class FuncionariosEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true, nullable: false, default: 0 })
  id_empresas: number;

  @ManyToOne(() => EmpresasEntity, { nullable: false })
  @JoinColumn({ name: 'id_empresas' })
  empresas: EmpresasEntity;

  @Column({ type: 'int', unsigned: true, nullable: false, default: 0 })
  id_pessoas: number;

  @ManyToOne(() => PessoasEntity, { nullable: false })
  @JoinColumn({ name: 'id_pessoas' })
  pessoas: PessoasEntity;

  @Column({ type: 'varchar', length: 60, nullable: false, collation: 'utf8mb4_general_ci' })
  nome: string;

  @Column({ type: 'varchar', length: 60, nullable: false, collation: 'utf8mb4_general_ci' })
  fantasy: string;

  @Column({ type: 'int', unsigned: true, nullable: false, default: 0 })
  createdBy: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @Column({ type: 'int', unsigned: true, nullable: false, default: 0 })
  updatedBy: number;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
