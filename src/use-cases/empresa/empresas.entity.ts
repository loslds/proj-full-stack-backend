
//C:\repository\proj-full-stack-backend\src\use-cases\empresa\empresas.entity.ts
import { Column, Entity, PrimaryGeneratedColumn, Unique, ManyToOne, JoinColumn } from 'typeorm'; 

import { PessoasEntity } from '../pessoa/pessoas.entity';
@Entity('empresas')

export class EmpresasEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;
  
  @ManyToOne(() => PessoasEntity)
  @JoinColumn({ name: 'id_pessoa' })
  pessoa: PessoasEntity;

  @Column({ type: 'int', nullable: false, unsigned: true, default: 0 })
  id_pessoa: number;



  @Column({ type: 'varchar', length: 60, nullable: false })
  nome: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  fantasy: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  arqlogo?: string;

  @Column({ type: 'blob', nullable: true })
  imagelogo?: Buffer;

  @Column({ type: 'int', nullable: true, unsigned: true, default: null })
  createdBy?: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'int', nullable: true, unsigned: true, default: null })
  updatedBy?: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;
}
