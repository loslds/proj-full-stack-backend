//C:\repository\proj-full-stack-backend\src\use-cases\cidades\cidades.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { EstadosEntity } from '../estado/estados.entity'; // ajuste o caminho conforme sua estrutura

@Entity('cidades')
export class CidadesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_estados: number;

  @ManyToOne(() => EstadosEntity)
  @JoinColumn({ name: 'id_estados' })
  estado: EstadosEntity;
  
  @Column({ length: 255 })
  nome: string;

  @Column({ length: 2 })
  sigla: string;

  @Column({ default: 0 })
  createdBy: number;

  @Column({ default: 0 })
  updatedBy: number;
}
