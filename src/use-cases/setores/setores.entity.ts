
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('setores')
@Unique(['name']) // Adiciona a restrição de unicidade composta
export class SetoresEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;
  
  @Column({ type: 'varchar', length: 45, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  acao: string;

  @Column({ type: 'int', length: 2, nullable: true })
  nivel?: number;

  @Column({ type: 'int', nullable: true, default: null })
  createdBy?: number;

  @Column({
    type: 'datetime',
    nullable: true,
    precision: null,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ type: 'int', nullable: true })
  updatedBy?: number;

  @Column({
    type: 'datetime',
    nullable: true,
    precision: null,
  })
  updatedAt?: Date;

}
