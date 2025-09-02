
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'; 
import { PessoasEntity } from '../pessoa/pessoas.entity';
@Entity('empresas')

export class EmpresasEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @ManyToOne(() => PessoasEntity)
  @JoinColumn({ name: 'id_pessoa' })
  pessoa: PessoasEntity;

  @Column({ type: 'int', nullable: false, unsigned: true })
  id_pessoa: number;

  @Column({ type: 'varchar', length: 45, nullable: false })
  nmempresa: string;

  @Column({ type: 'varchar', length: 45, nullable: false })
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
