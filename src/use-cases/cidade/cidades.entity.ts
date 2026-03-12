
// C:\repository\proj-full-stack-backend\src\use-cases\cidade\cidades.entity.ts
import { 
  Column, 
  Entity, 
  PrimaryGeneratedColumn, 
  Unique, 
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

import { EstadosEntity } from '../estado/estados.entity';
@Entity('cidades')
@Unique(['nome', 'id_estados'])
export class CidadesEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true
  })
  id: number;
//================
  @Column({
    type: 'int',
    unsigned: true,
    nullable: false
  })
  id_estados: number;

  @ManyToOne(() => EstadosEntity, { nullable: false })
  @JoinColumn({
    name: 'id_estados'
  })
  estado: EstadosEntity;
//=================
  @Column({
    type: 'varchar',
    length: 120,
    nullable: false,
    collation: 'utf8mb4_general_ci'
  })
  nome: string;

  @Column({
    type: 'int',
    unsigned: true,
    nullable: false,
    default: 0
  })
  createdBy: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @Column({
    type: 'int',
    unsigned: true,
    nullable: false,
    default: 0
  })
  updatedBy: number;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}