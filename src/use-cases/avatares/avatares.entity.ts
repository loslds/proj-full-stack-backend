
import { Column, Entity, PrimaryGeneratedColumn, } from 'typeorm';

@Entity('avatares')

export class PerguntasEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number; // O campo 'id' será autoincremento

  @Column({ unique: true, type: 'varchar', length: 100, nullable: false })
  nomearq: string;
  
  @Column({ type: 'text', length: 100, nullable: false })
  avatar: string;

  @Column({ unique: true, type: 'varchar', length: 100, nullable: false })
  descrperg: string;

  ////////////////////

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


