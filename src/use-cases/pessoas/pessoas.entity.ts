
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pessoas')

export class PessoasEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number; // O campo 'id' será autoincremento

  @Column({ unique: true, type: 'varchar', length: 45, nullable: false })
  nmpessoa: string;

  @Column({ unique: true, type: 'varchar', length: 5, nullable: false })
  sigla: string;

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


