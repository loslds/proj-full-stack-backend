import { Column, Entity } from 'typeorm';

@Entity('modulo')

export class ModuloEntity {
  @Column({ primary: true, generated: true, type: 'int', nullable: false })
  id: number;

  @Column({ primary: true, type: 'varchar', length: 45, nullable: false })
  name: string;

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
