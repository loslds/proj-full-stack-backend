import { Column, Entity } from 'typeorm';

@Entity('pessoa')

export class PessoaEntity {
  @Column({ primary: true, generated: true, type: 'int', nullable: false })
  id: number;

  @Column({ unique: true, type: 'varchar', length: 45, nullable: false })
  descr: string;

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
