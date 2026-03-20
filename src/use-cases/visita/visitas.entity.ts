
 
// C:\repository\proj-full-stack-backend\src\use-cases\visita\visitas.entity.ts
// C:\repository\proj-full-stack-backend\src\use-cases\visita\visitas.entity.ts
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

import { VisitantesEntity } from '../visitante/visitantes.entity';

@Entity('visitas')
@Index('idx_visitas_id_visitantes', ['id_visitantes'])
export class VisitasEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true
  })
  id: number;

  @Column({
    type: 'int',
    unsigned: true,
    nullable: false,
    default: 0
  })
  id_visitantes: number;

  @ManyToOne(() => VisitantesEntity, { nullable: false })
  @JoinColumn({ name: 'id_visitantes' })
  visitantes: VisitantesEntity;

  @Column({
    type: 'int',
    unsigned: true,
    nullable: false,
    default: 0
  })
  tempo_visita: number;

  @Column({
    type: 'datetime',
    nullable: true,
    default: null
  })
  saidaAt: Date | null;

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
    nullable: true,
    default: 0
  })
  updatedBy: number;

  @UpdateDateColumn({
    type: 'datetime'
  })
  updatedAt: Date;
}