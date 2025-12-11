
// C:\repository\proj-full-stack-backend\src\use-cases\cidades\cidades.entity.ts
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
@Unique(['nome', 'id_estados']) // evita cidade duplicada no mesmo estado
export class CidadesEntity {

  @PrimaryGeneratedColumn({ 
    type: 'int', 
    unsigned: true 
  })
  id: number;

  // CHAVE ESTRANGEIRA -> Estados
  @Column({ 
    type: 'int', 
    unsigned: true, 
    nullable: false 
  })
  id_estados: number;

  @ManyToOne(() => EstadosEntity)
  @JoinColumn({ 
    name: 'id_estados' 
  })
  estado: EstadosEntity;

  @Column({ 
    type: 'varchar',
    length: 60,
    nullable: false,
    collation: 'utf8mb4_general_ci'
  })
  nome: string;

  @Column({ 
    type: 'varchar',
    length: 5,
    nullable: false,
    collation: 'utf8mb4_general_ci'
  })
  uf: string;

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
