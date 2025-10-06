//C:\repository\proj-full-stack-backend\src\use-cases\cidades\cidades.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique
} from 'typeorm';

import { EstadosEntity } from '../estado/estados.entity'; // ajuste o caminho conforme sua estrutura

export class CidadesEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

   // 🔹 Campo para armazenar o id do estados
  @Column({ type: 'int', nullable: false })
  id_estados: number;
  // 🔹 Relacionamento com Pessoas
  @ManyToOne(() => EstadosEntity)
  @JoinColumn({ name: 'id_estados' })
  estados: EstadosEntity;

  @Column({ type: 'varchar', length: 60, nullable: false })
  nome: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  sigla: string;

  @Column({ type: 'int', nullable: true, unsigned: true, default: null })
  createdBy?: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'int', nullable: true, unsigned: true, default: null })
  updatedBy?: number;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
